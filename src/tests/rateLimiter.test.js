import { checkRateLimit } from "../rateLimiter.js";

describe(
  "rate limiter",
  () => {
   
    test(
      "allows under limit",
      async () => {

        const store = {};

        const env = {
          RATE_LIMITS: {
            get: jest.fn(
              async key =>
                store[key]
            ),
            put: jest.fn(
              async (
                key,
                value
              ) => {
                store[key] =
                  value;
              }
            )
          }
        };

        const result =
          await checkRateLimit(
            env,
            "chat:test",
            20,
            3600
          );

        expect(
          result.allowed
        ).toBe(true);
      }
    );
  }
);


test(
 "blocks after limit",
 async () => {

  const env = {
   RATE_LIMITS: {
    get: jest.fn(
      async () => "20"
    ),
    put: jest.fn()
   }
  };

  const result =
   await checkRateLimit(
    env,
    "chat:test",
    20,
    3600
   );

  expect(
   result.allowed
  ).toBe(false);
 }
);

 test(
    "increments count",
    async () => {

        const store = {};

        const env = {
        RATE_LIMITS: {
            get: jest.fn(
            async key => store[key]
            ),
            put: jest.fn(
            async (key, value) => {
                store[key] = value;
            }
            )
        }
        };

        await checkRateLimit(
        env,
        "chat:test",
        20,
        3600
        );

        expect(
        store["chat:test"]
        ).toBe("1");
    }
    );

        