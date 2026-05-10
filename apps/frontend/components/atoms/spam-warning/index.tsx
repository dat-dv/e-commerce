import React, { memo } from 'react';

import { useSpamListener } from '@/hooks/use-spam-listener';

const SpamWarning = ({ isSpam, message }: { isSpam: boolean; message?: string }) => {
  useSpamListener({ isSpam, message });
  return <></>;
};

export default memo(SpamWarning);
