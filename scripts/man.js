const sections = [
  {
    title: "DAILY DEV",
    commands: [
      [
        "npm run dev",
        "Run the full stack: Shared watcher, i18n watcher, Frontend, Backend.",
      ],
      ["npm run dev:fe", "Run Frontend with Shared watcher and i18n watcher."],
      ["npm run dev:be", "Run Backend with Shared watcher."],
      ["npm run debug:be", "Run Backend debug mode with Shared watcher."],
    ],
  },
  {
    title: "I18N",
    commands: [
      [
        "npm run i18n:gen",
        "Merge apps/frontend/messages/{en,vi}/*.json into generated locale files.",
      ],
    ],
  },
  {
    title: "FRONTEND",
    commands: [
      ["npm run build:fe", "Build Frontend."],
      ["npm run lint:fe", "Lint Frontend."],
      ["npm run type-check", "Type check Frontend."],
    ],
  },
  {
    title: "BACKEND",
    commands: [
      ["npm run build:be", "Build Backend."],
      ["npm run test:be", "Run Backend tests."],
      ["npm run lint:be", "Lint Backend."],
      ["npm run format:be", "Format Backend source and tests."],
      ["npm run db:reset", "Reset Backend database and seed data."],
    ],
  },
  {
    title: "ALL WORKSPACES",
    commands: [
      ["npm run build", "Build all workspaces."],
      ["npm run test", "Run tests for all workspaces."],
      ["npm run lint", "Lint all workspaces."],
      ["npm run format", "Format the repository."],
    ],
  },
];

console.log("AVAILABLE COMMANDS IN MONOREPO");
console.log("================================");

for (const section of sections) {
  console.log(`\n${section.title}`);
  console.log("-".repeat(section.title.length));

  for (const [command, description] of section.commands) {
    console.log(`${command.padEnd(22)} ${description}`);
  }
}

console.log("\nNOTES");
console.log("-----");
console.log(
  "Root dev scripts own orchestration. Workspace dev scripts run only their app.",
);
console.log(
  "Internal root scripts prefixed with '_' are implementation details.",
);
console.log(
  "The i18n watcher observes messages/en and messages/vi, not generated files.",
);
