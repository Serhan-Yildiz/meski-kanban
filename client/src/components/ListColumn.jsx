export default function ListColumn({ list }) {
  return (
    <div>
      <h3>{list.title}</h3>

      <ul>
        {list.cards.map((card) => (
          <li key={card.id}>{card.title}</li>
        ))}
      </ul>

      {/* İleride: Kart ekleme formu burada olabilir */}
    </div>
  );
}
