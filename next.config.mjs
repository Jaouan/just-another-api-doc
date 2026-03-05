/** @type {import('next').NextConfig} */
const nextConfig = {
	reactCompiler: true,
	output: "export",
	turbopack: {
		rules: {
			"*.yml": {
				loaders: ["yaml-loader"],
				as: "*.js",
			},
		},
	},
	webpack: (config) => {
		config.module.rules.push({
			test: /\.ya?ml$/,
			use: "yaml-loader",
		});
		return config;
	},
};

export default nextConfig;
