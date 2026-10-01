export const store = new Map();

export function resetFakeDb() {
  store.clear();
}

export function seedFakeDb(getDbMock) {
  getDbMock.mockImplementation(() => ({
    insert: () => ({
      values: ({ emailAdress }) => ({
        onConflictDoNothing: () => ({
          returning: async () => {
            if (store.has(emailAdress)) return [];
            store.set(emailAdress, { emailAdress });
            return [{ emailAdress }];
          },
        }),
      }),
    }),
  }));
}
