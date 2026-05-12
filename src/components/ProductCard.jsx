import "./ProductCard.css";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} className="product-card__img" />
      <div className="product-card__content">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-card__bottom">
          <strong>{product.price} FCFA</strong>
          <button>Acheter</button>
        </div>
      </div>
    </article>
  );
}