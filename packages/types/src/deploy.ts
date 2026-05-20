export type DeployConfig = {
    repoUrl: string;
    branch: string;
    buildCommand: string;
    startCommand: string;
    env?: Record<string, string>;
};