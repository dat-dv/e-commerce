'use client';

import '@xyflow/react/dist/style.css';

import {
  addEdge,
  Background,
  BackgroundVariant,
  BaseEdge,
  Connection,
  Controls,
  Edge,
  EdgeLabelRenderer,
  EdgeProps,
  Handle,
  MarkerType,
  MiniMap,
  Node,
  NodeProps,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  reconnectEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import { motion } from 'framer-motion';
import {
  Download,
  Maximize,
  MousePointer2,
  RotateCcw,
  Terminal,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import React, { useCallback, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface FlowViewerProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  title?: string;
  height?: string | number;
}

// ─── Custom Bezier Edge ───────────────────────────────────────────────────────
const BezierEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  label,
  style,
  markerEnd,
  selected,
  data,
}: EdgeProps) => {
  const { setEdges } = useReactFlow();

  // ─── Logic bẻ cong thực sự (Quadratic Bezier) ──────────────────────────────
  const { screenToFlowPosition } = useReactFlow();

  // Tính toán trung điểm để làm mốc
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  // Curvature bây giờ đóng vai trò là Offset (độ lệch)
  const bendOffset = (data?.curvature as number) ?? 0;

  // Tính vector pháp tuyến (đường vuông góc với line) để bẻ cong
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;

  // Normal vector (xoay 90 độ)
  const nx = -dy / dist;
  const ny = dx / dist;

  // Điểm điều khiển (Control Point) cho đường cong Quadratic
  const cpX = midX + nx * bendOffset;
  const cpY = midY + ny * bendOffset;

  // -- Rút ngắn đường nối ở đoạn cuối để không bị Node đè lên mũi tên to --
  // Tính hướng từ Control Point tới Target
  const endDx = targetX - cpX;
  const endDy = targetY - cpY;
  const endDist = Math.sqrt(endDx * endDx + endDy * endDy) || 1;

  // Lùi điểm cuối về sau 20px
  const shortenOffset = 20;
  const adjTargetX = targetX - (endDx / endDist) * shortenOffset;
  const adjTargetY = targetY - (endDy / endDist) * shortenOffset;

  // Tạo đường SVG: M (Move to Start) Q (Quadratic Curve to adjTarget via Control Point)
  const edgePath = `M ${sourceX},${sourceY} Q ${cpX},${cpY} ${adjTargetX},${adjTargetY}`;

  // Vị trí Label/Handle (là đỉnh của đường cong Q tại t=0.5)
  // Công thức: P = (1-t)^2*P0 + 2(1-t)t*P1 + t^2*P2
  const labelX = 0.25 * sourceX + 0.5 * cpX + 0.25 * targetX;
  const labelY = 0.25 * sourceY + 0.5 * cpY + 0.25 * targetY;

  const onHandlePointerDown = (event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const handle = event.currentTarget as HTMLDivElement;
    handle.setPointerCapture(event.pointerId);

    const onPointerMove = (e: PointerEvent) => {
      const flowPos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const mouseDx = flowPos.x - midX;
      const mouseDy = flowPos.y - midY;
      const newOffset = (mouseDx * nx + mouseDy * ny) * 2;
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === id) {
            return { ...edge, data: { ...edge.data, curvature: newOffset } };
          }
          return edge;
        }),
      );
    };

    const onPointerUp = (e: PointerEvent) => {
      handle.releasePointerCapture(e.pointerId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        interactionWidth={30}
        style={{
          ...style,
          strokeWidth: selected ? 3 : ((style?.strokeWidth as number) ?? 2),
          filter: selected
            ? 'drop-shadow(0 0 12px rgba(255,255,255,0.4))'
            : (style?.filter as string),
        }}
        markerEnd={markerEnd}
      />

      {label && (
        <EdgeLabelRenderer>
          <div
            onPointerDown={onHandlePointerDown}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 6,
              cursor: 'grab',
              outline: selected ? '2px solid rgba(59,130,246,0.3)' : undefined,
              ...(data?.labelStyle as React.CSSProperties),
            }}
            className="px-2 py-0.5 rounded-md bg-[#0c0f17]/90 border border-white/10 whitespace-nowrap shadow-xl select-none nopan nodrag active:cursor-grabbing"
          >
            {label as string}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

// ─── Custom Node ──────────────────────────────────────────────────────────────
export const CustomNode = ({ data, selected }: NodeProps) => {
  const hCls =
    'w-3 h-3 !bg-primary border-2 border-white shadow-lg opacity-0 group-hover:opacity-100 transition-all';

  return (
    <>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        className={`px-6 py-4 rounded-xl bg-white/10 backdrop-blur-xl border shadow-[0_0_25px_rgba(59,130,246,0.15)] min-w-[180px] text-center relative group transition-all ${
          selected ? 'border-primary/80 shadow-[0_0_30px_rgba(59,130,246,0.4)]' : 'border-white/20'
        }`}
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />

        {/* 8 handles — 2 per side (source @ 30%, target @ 70%) */}
        <Handle
          id="source-top"
          type="source"
          position={Position.Top}
          style={{ left: '30%' }}
          className={hCls}
        />
        <Handle
          id="target-top"
          type="target"
          position={Position.Top}
          style={{ left: '70%' }}
          className={hCls}
        />
        <Handle
          id="source-right"
          type="source"
          position={Position.Right}
          style={{ top: '30%' }}
          className={hCls}
        />
        <Handle
          id="target-right"
          type="target"
          position={Position.Right}
          style={{ top: '70%' }}
          className={hCls}
        />
        <Handle
          id="source-bottom"
          type="source"
          position={Position.Bottom}
          style={{ left: '70%' }}
          className={hCls}
        />
        <Handle
          id="target-bottom"
          type="target"
          position={Position.Bottom}
          style={{ left: '30%' }}
          className={hCls}
        />
        <Handle
          id="source-left"
          type="source"
          position={Position.Left}
          style={{ top: '70%' }}
          className={hCls}
        />
        <Handle
          id="target-left"
          type="target"
          position={Position.Left}
          style={{ top: '30%' }}
          className={hCls}
        />

        <div className="min-h-[66px] min-w-[80px] flex flex-col items-center justify-center gap-2 relative z-10">
          <span className="text-sm font-black tracking-tight text-white drop-shadow-md uppercase">
            {data.label as React.ReactNode}
          </span>
        </div>
      </motion.div>
    </>
  );
};
const nodeTypes = { custom: CustomNode };
const edgeTypes = { bezier: BezierEdge };

// ─── Inner (cần ReactFlowProvider bao ngoài để dùng useReactFlow) ─────────────
const FlowViewerInner = ({
  initialNodes,
  initialEdges,
  title,
  height,
}: Required<FlowViewerProps>) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const edgeReconnectSuccessful = useRef(true);

  const { fitView, zoomIn, zoomOut } = useReactFlow();

  // ── Reset ─────────────────────────────────────────────────────────────────
  const onReset = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // ── Connect (vẽ edge mới) ─────────────────────────────────────────────────
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'bezier',
            animated: true,
            style: {
              stroke: '#60a5fa',
              strokeWidth: 2,
              filter: 'drop-shadow(0 0 6px rgba(96,165,246,0.5))',
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#60a5fa',
              width: 25,
              height: 25,
            },
            data: { curvature: 0.35 },
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  // ── Reconnect edge ────────────────────────────────────────────────────────
  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeReconnectSuccessful.current = true;
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    },
    [setEdges],
  );

  const onReconnectEnd = useCallback(
    (_event: MouseEvent | TouchEvent, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      edgeReconnectSuccessful.current = true;
    },
    [setEdges],
  );

  // ── Export SVG (Xây dựng lại toàn bộ Sơ đồ chuẩn SVG) ──────────────────────
  const onExport = useCallback(() => {
    if (nodes.length === 0) return;

    // 1. Tính toán vùng bao (Bounding Box)
    const minX = Math.min(...nodes.map((n) => n.position.x)) - 100;
    const minY = Math.min(...nodes.map((n) => n.position.y)) - 100;
    const maxX = Math.max(...nodes.map((n) => n.position.x + 250)) + 100;
    const maxY = Math.max(...nodes.map((n) => n.position.y + 150)) + 100;
    const width = maxX - minX;
    const height = maxY - minY;

    // 2. Tạo một thẻ SVG mới tinh từ hư vô
    const svgNS = 'http://www.w3.org/2000/svg';
    const finalSvg = document.createElementNS(svgNS, 'svg');
    finalSvg.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
    finalSvg.setAttribute('width', width.toString());
    finalSvg.setAttribute('height', height.toString());
    finalSvg.setAttribute('xmlns', svgNS);

    // 3. Nền tối cho chuyên nghiệp
    const bg = document.createElementNS(svgNS, 'rect');
    bg.setAttribute('x', minX.toString());
    bg.setAttribute('y', minY.toString());
    bg.setAttribute('width', width.toString());
    bg.setAttribute('height', height.toString());
    bg.setAttribute('fill', '#0c0f17');
    finalSvg.appendChild(bg);

    // 4. Vẽ các đường nối (Edges)
    edges.forEach((edge) => {
      const edgeElem = document.querySelector(
        `[data-testid="rf__edge-${edge.id}"] path.react-flow__edge-path`,
      ) as SVGPathElement;
      if (edgeElem) {
        const clonedPath = edgeElem.cloneNode(true) as SVGPathElement;
        clonedPath.setAttribute('stroke', '#3b82f6');
        clonedPath.setAttribute('stroke-width', '2');
        clonedPath.setAttribute('fill', 'none');
        finalSvg.appendChild(clonedPath);
      }
    });

    // 5. Vẽ các Node (Tự dựng hình chữ nhật và Chữ)
    nodes.forEach((node) => {
      const g = document.createElementNS(svgNS, 'g');
      g.setAttribute('transform', `translate(${node.position.x},${node.position.y})`);

      // Hình chữ nhật (Node Box)
      const rect = document.createElementNS(svgNS, 'rect');
      rect.setAttribute('width', '200');
      rect.setAttribute('height', '80');
      rect.setAttribute('rx', '20');
      rect.setAttribute('fill', 'rgba(59, 130, 246, 0.1)');
      rect.setAttribute('stroke', '#3b82f6');
      rect.setAttribute('stroke-width', '1');
      g.appendChild(rect);

      // Chữ (Label)
      const text = document.createElementNS(svgNS, 'text');
      text.setAttribute('x', '100');
      text.setAttribute('y', '45');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-family', 'sans-serif');
      text.setAttribute('font-size', '14');
      text.setAttribute('font-weight', 'bold');
      text.textContent = (node.data.label as string) || '';
      g.appendChild(text);

      finalSvg.appendChild(g);
    });

    // 6. Xuất file
    const xml = new XMLSerializer().serializeToString(finalSvg);
    const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [nodes, edges, title]);

  return (
    <div
      className="group relative w-full my-16 rounded-[2.5rem] overflow-hidden bg-[#0c0f17] border border-white/10 shadow-[0_45px_100px_-20px_rgba(0,0,0,0.6)] transition-all hover:border-primary/30"
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      <style>
        {`
          .react-flow__edges {
            z-index: 10 !important;
            pointer-events: none;
          }
          .react-flow__edge {
            pointer-events: all;
          }
          .react-flow__handle {
            opacity: 0 !important;
            transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
            transform: scale(1);
          }
          .react-flow__node:hover .react-flow__handle {
            opacity: 1 !important;
          }
          /* Phồng to + phát sáng khi hover trực tiếp vào handle */
          .react-flow__handle:hover {
            opacity: 1 !important;
            transform: scale(2.5) !important;
            box-shadow: 0 0 12px rgba(59, 130, 246, 0.9) !important;
            z-index: 999 !important;
          }
          .react-flow__handle-connecting,
          .react-flow__handle-valid {
            opacity: 1 !important;
            transform: scale(2.5) !important;
            box-shadow: 0 0 16px rgba(59, 130, 246, 1) !important;
          }
        `}
      </style>

      {/* Header */}
      <div className="absolute top-8 left-8 z-10 flex items-center gap-4 pointer-events-none">
        <div className="p-3 rounded-2xl bg-primary/20 border border-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          <MousePointer2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="text-sm font-black tracking-[0.2em] uppercase text-white/60">{title}</h4>
          <p className="text-[10px] text-primary/40 uppercase font-black tracking-widest">
            Interactive Navigation
          </p>
        </div>
      </div>

      <div style={{ height }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          edgesReconnectable
          nodesDraggable
          selectionOnDrag
          deleteKeyCode="Delete"
          multiSelectionKeyCode="Shift"
          fitView
          fitViewOptions={{ padding: 0.3 }}
          colorMode="dark"
          proOptions={{ hideAttribution: true }}
          snapToGrid
          snapGrid={[16, 16]}
          defaultEdgeOptions={{
            type: 'bezier',
            animated: true,
            style: {
              stroke: '#60a5fa',
              strokeWidth: 2,
              filter: 'drop-shadow(0 0 6px rgba(96,165,246,0.5))',
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#60a5fa',
              width: 25,
              height: 25,
            },
          }}
        >
          <Background variant={BackgroundVariant.Dots} color="#1e293b" gap={24} size={2} />

          <Controls
            showFitView
            showInteractive
            className="bg-black/60 backdrop-blur-md border border-white/10 fill-primary rounded-2xl !p-2"
          />

          <MiniMap
            className="rounded-3xl border border-white/10 bg-black/80 shadow-2xl overflow-hidden"
            nodeColor="#3b82f6"
            maskColor="rgba(0,0,0,0.8)"
            zoomable
            pannable
          />

          {/* Custom toolbar */}
          <Panel position="bottom-right" className="p-6">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => zoomIn({ duration: 300 })}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary/20 transition-all text-white/40 hover:text-white shadow-xl backdrop-blur-xl active:scale-90"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => zoomOut({ duration: 300 })}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary/20 transition-all text-white/40 hover:text-white shadow-xl backdrop-blur-xl active:scale-90"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => fitView({ padding: 0.3, duration: 400 })}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary/20 transition-all text-white/40 hover:text-white shadow-xl backdrop-blur-xl active:scale-90"
                title="Fit view"
              >
                <Maximize className="w-4 h-4" />
              </button>
              <button
                onClick={onReset}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-amber-500/20 transition-all text-white/40 hover:text-amber-400 shadow-xl backdrop-blur-xl active:scale-90"
                title="Reset về ban đầu"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const mdxCode = `<FlowViewer
  title="${title}"
  height={${height}}
  initialNodes={${JSON.stringify(nodes, null, 2)}}
  initialEdges={${JSON.stringify(edges, null, 2)}}
/>`;
                  console.group(
                    '%c 🚀 MDX CONFIGURATION READY ',
                    'background: #10b981; color: white; padding: 4px; border-radius: 4px; font-weight: bold;',
                  );
                  console.log(mdxCode);
                  console.groupEnd();
                  alert(
                    'ĐÃ LOG CODE MDX! Anh hãy vào Console (F12) để Copy nguyên đoạn mã <FlowViewer /> nhé.',
                  );
                }}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-emerald-500/20 transition-all text-white/40 hover:text-emerald-400 shadow-xl backdrop-blur-xl active:scale-90"
                title="Copy MDX Code"
              >
                <Terminal className="w-4 h-4 translate-y-[1px]" />
              </button>
              <button
                onClick={onExport}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-violet-500/20 transition-all text-white/40 hover:text-violet-400 shadow-xl backdrop-blur-xl active:scale-90"
                title="Export SVG"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

// ─── Export bọc ReactFlowProvider ────────────────────────────────────────────
export const FlowViewer = (props: FlowViewerProps) => (
  <ReactFlowProvider>
    <FlowViewerInner
      initialNodes={props.initialNodes}
      initialEdges={props.initialEdges}
      title={props.title ?? 'Architecture Blueprint'}
      height={props.height ?? 500}
    />
  </ReactFlowProvider>
);
