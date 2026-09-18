export const store = new Map();

export function resetFakeDb() {
  store.clear();
}

export function seedFakeDb(getDbMock) {
  getDbMock.mockImplementation(() => ({
    insert: () => ({
      values: ({ email }) => ({
        onConflictDoNothing: () => ({
          returning: async () => {
            if (store.has(email)) return [];
            store.set(email, { email });
            return [{ email }];
          },
        }),
      }),
    }),
  }));
}
