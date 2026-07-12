export class RateLimiterDO {

    constructor(state, env) {
        this.state = state;
        this.env = env;
    }

    async fetch(request) {

        const { limit, windowSeconds } = await request.json();

        let count = (await this.state.storage.get("count")) || 0; //Each Durable Object has its own private storage.

        if (count >= limit) {

            return Response.json({
                allowed: false,
                remaining: 0
            });

        }

        count++;

        await this.state.storage.put( //this write is atomic. No race conditions
            "count",
            count
        );

        const alarm =
            await this.state.storage.getAlarm();

        if (!alarm) {

            await this.state.storage.setAlarm(
                Date.now() +
                windowSeconds * 1000
            );

        }

        return Response.json({

            allowed: true,
            remaining: limit - count

        });

    }

    async alarm() {

        await this.state.storage.deleteAll();

    }

}