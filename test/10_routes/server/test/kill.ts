import DumpServer from "~/DumpServer";

const slow = 10;
const name = "/server/test/kill";

export default {
  name,
  handler: function (this: Mocha.Suite) {
    this.slow(slow);

    it("must be closed in production", (done) => {
      const prod = DumpServer.get("production");
      prod.postForNotFound(name, done);
    });
  },
};
