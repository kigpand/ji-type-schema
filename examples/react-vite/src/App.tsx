import "./App.css";
import {
  booleanSchema,
  numberSchema,
  objectSchema,
  stringSchema,
} from "ji-type-schema";

const UserSchema = objectSchema({
  name: stringSchema(),
  age: numberSchema(),
  active: booleanSchema(),
});

const validUser = { name: "kim", age: 28, active: true };
const invalidUser = { name: "kim", age: "28", active: "yes" };

function App() {
  const ok = UserSchema.safeParse(validUser);
  const bad = UserSchema.safeParse(invalidUser);

  return (
    <main className="app">
      <h1>ji-type-schema example</h1>
      <section>
        <h2>Valid</h2>
        <pre>{JSON.stringify(ok, null, 2)}</pre>
      </section>
      <section>
        <h2>Invalid</h2>
        <pre>{JSON.stringify(bad, null, 2)}</pre>
      </section>
    </main>
  );
}

export default App;
