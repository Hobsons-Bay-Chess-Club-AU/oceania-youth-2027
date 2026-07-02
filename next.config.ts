import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserOrOrgPagesRepo = repositoryName.endsWith(".github.io");
const usesCustomDomain = process.env.GITHUB_PAGES_CUSTOM_DOMAIN === "true";
const basePath =
  isGithubActions && repositoryName && !isUserOrOrgPagesRepo && !usesCustomDomain
    ? `/${repositoryName}`
    : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
