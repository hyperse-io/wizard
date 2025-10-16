const mockOptions = {
  hostname: "dev.wizard.com",
  mockBaseDir: `./mocks`,
  port: 40000,
  chunkSize: 3,
  staticMap: {
    "/static": "static",
  },
};

const evolveOptions = {
  entryMap: {
    home: {
      entry: ["./src/home/index.tsx"],
      options: {},
    },
    mine: {
      entry: ["./src/mine/index.tsx"],
      options: {},
    },
  },
};

export default () => {
  return {
    "build.evolve": () => {
      return evolveOptions;
    },
    mock: mockOptions,
  };
};
