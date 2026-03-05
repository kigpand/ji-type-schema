# ji-type-schema

가벼운 타입 스키마 검증 라이브러리입니다. 런타임 검증(`parse/safeParse`)과 사용성 높은 유틸(`is/assert`, `optional/nullable/refine`, `formatErrors/flattenErrors`)을 제공합니다.

## 설치

```bash
npm install ji-type-schema
```

## 빠른 시작

```ts
import { booleanSchema, numberSchema, objectSchema, stringSchema } from "ji-type-schema";

const UserSchema = objectSchema({
  name: stringSchema(),
  age: numberSchema(),
  active: booleanSchema(),
});

const result = UserSchema.safeParse({ name: "kim", age: 28, active: true });
```

## 타입 좁히기 (Infer + is/assert)

```ts
import type { Infer } from "ji-type-schema";
import { objectSchema, stringSchema, numberSchema } from "ji-type-schema";

const UserSchema = objectSchema({
  name: stringSchema(),
  age: numberSchema(),
});

type User = Infer<typeof UserSchema>;

const input: unknown = { name: "kim", age: 28 };

if (UserSchema.is(input)) {
  const user: User = input;
}

UserSchema.assert(input);
```

## optional / nullable / refine

```ts
import { numberSchema, stringSchema } from "ji-type-schema";

const ageSchema = numberSchema().optional();
const nicknameSchema = stringSchema().nullable();
const positiveSchema = numberSchema().refine((v) => v > 0, "Must be positive", "too_small");
```

## 배열 스키마

```ts
import { arraySchema, stringSchema } from "ji-type-schema";

const TagsSchema = arraySchema(stringSchema().optional());
const result = TagsSchema.safeParse(["dev", undefined, "ts"]);
```

## 에러 포맷/플랫

```ts
import { formatErrors, flattenErrors } from "ji-type-schema";

const result = UserSchema.safeParse({ name: 123, age: "20" });
if (!result.success) {
  const lines = formatErrors(result.errors);
  const flat = flattenErrors(result.errors);
}
```

## API 요약

- `schema.parse(input)` : 실패 시 throw
- `schema.safeParse(input)` : `{ success, data | errors }`
- `schema.is(input)` : 타입 가드
- `schema.assert(input)` : 실패 시 throw, 성공 시 타입 좁힘
- `schema.optional()` : `undefined` 허용
- `schema.nullable()` : `null` 허용
- `schema.refine(check, message?, code?)` : 커스텀 검증
- `arraySchema(itemSchema)` : 배열 스키마
- `formatErrors(errors)` / `flattenErrors(errors)` : 에러 가공 유틸

## 개발

```bash
pnpm build
pnpm test
pnpm smoke
```

## 배포

```bash
npm run release:patch
npm run release:minor
npm run release:major
```
