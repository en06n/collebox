import { db } from '@/db';
import { items } from '@/db/schema';

export default async function Home() {
  const itemsData = await db.select().from(items);

  return (
    <main>
      <h1>collebox</h1>

      {itemsData.map((item) => (
        <div key={item.id}>
          <p>{item.name}</p>
          <p>所持数: {item.quantity}</p>
        </div>
      ))}
    </main>
  );
}