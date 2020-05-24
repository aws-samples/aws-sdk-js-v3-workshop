const { exec } = require("child_process");
const { join } = require("path");

(async () => {
  const outputsFile = join(
    __dirname,
    `tmp.${Math.ceil(Math.random() * 10 ** 10)}.json`
  );

  const execProcess = exec(`yarn cdk deploy --outputs-file ${outputsFile}`, {
    cwd: join(__dirname, "infra"),
  });
  execProcess.stdout.pipe(process.stdout);
  execProcess.stderr.pipe(process.stderr);
  await new Promise((resolve) => {
    execProcess.on("exit", resolve);
  });
})();
