/*"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { allCocktails } from "../../constants/index.js";

const Menu = () => {
  const contentRef = useRef();

  const [currentIndex, setCurrentIndex] = useState(0);

  useGSAP(() => {
    gsap.fromTo("#title", { opacity: 0 }, { opacity: 1, duration: 1 });
    gsap.fromTo(
      ".cocktail img",
      { opacity: 1, xPercent: -100 },
      { xPercent: 0, opacity: 1, duration: 1, ease: "power1.inOut" },
    );
    gsap.fromTo(
      ".details h2",
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 100,
        ease: "power1.inOut",
      },
    );
    gsap.fromTo(
      ".details p",
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 100,
        ease: "power1.inOut",
      },
    );
  }, [currentIndex]);

  const totalCocktails = allCocktails.length;
  const goToSlide = (index) => {
    const newIndex = (index + totalCocktails) % totalCocktails;
    setCurrentIndex(newIndex);
  };
  const getCocktailAt = (indexOffset) => {
    return allCocktails[
      (currentIndex + indexOffset + totalCocktails) % totalCocktails
    ];
  };

  const currentCocktail = getCocktailAt(0);
  const prevCocktail = getCocktailAt(-1);
  const nextCocktail = getCocktailAt(1);

  return (
    <section id="menu" aria-labelledby="menu-heading">
      <img
        src="/images/slider-left-leaf.png"
        alt="left-leaf"
        id="m-left-leaf"
      />
      <img
        src="/images/slider-right-leaf.png"
        alt="right-leaf"
        id="m-right-leaf"
      />

      <h2 id="menu-heading" className="sr-only">
        Cocktail Menu
      </h2>
      <nav className="cocktail-tabs" aria-label="Cocktail Navigation">
        {allCocktails.map((cocktail, index) => {
          const isActive = index === currentIndex;

          return (
            <button
              key={cocktail.id}
              className={
                isActive
                  ? "text-white border-white"
                  : "text-white-50 border-white/50"
              }
              onClick={() => goToSlide(index)}
            >
              {cocktail.name}
            </button>
          );
        })}
      </nav>
      <div className="content">
        <div className="arrows">
          <button
            className="text-left"
            onClick={() => goToSlide(currentIndex - 1)}
          >
            <span>{prevCocktail.name}</span>
            <img
              src="/images/right-arrow.png"
              alt="right-arrow"
              aria-hidden="true"
            />
          </button>

          <button
            className="text-left"
            onClick={() => goToSlide(currentIndex + 1)}
          >
            <span>{nextCocktail.name}</span>
            <img
              src="/images/left-arrow.png"
              alt="left-arrow"
              aria-hidden="true"
            />
          </button>
        </div>
        <div className="cocktail">
          <img src={currentCocktail.image} className="object-contain" />
        </div>
        <div className="recipe">
          <div ref={contentRef} className="info">
            <p>Recipe for:</p>
            <p id="title">{currentCocktail.name}</p>
          </div>
          <div className="details">
            <h2>{currentCocktail.title}</h2>
            <p>{currentCocktail.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;
*/

"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { allCocktails } from "../../constants/index.js";

const Menu = () => {
  const contentRef = useRef();
  const directionRef = useRef(1); // 1 = next (sağa doğru), -1 = prev (sola doğru)

  const [currentIndex, setCurrentIndex] = useState(0);

  const totalCocktails = allCocktails.length;

  // goToSlide artık optional direction param alıyor
  const goToSlide = (index, direction = null) => {
    const newIndex = (index + totalCocktails) % totalCocktails;

    // Eğer yön parametresi verilmişse kullan, verilmediyse otomatik hesapla
    if (direction) {
      directionRef.current = direction > 0 ? 1 : -1;
    } else {
      // küçük bir mantık: en kısa rotayı seç
      const diff = (newIndex - currentIndex + totalCocktails) % totalCocktails;
      if (diff === 0) {
        directionRef.current = 0;
      } else if (diff <= totalCocktails / 2) {
        directionRef.current = 1; // ileri
      } else {
        directionRef.current = -1; // geri (wrap-around)
      }
    }

    setCurrentIndex(newIndex);
  };

  // helpers to access surrounding cocktails
  const getCocktailAt = (indexOffset) => {
    return allCocktails[
      (currentIndex + indexOffset + totalCocktails) % totalCocktails
    ];
  };

  const currentCocktail = getCocktailAt(0);
  const prevCocktail = getCocktailAt(-1);
  const nextCocktail = getCocktailAt(1);

  // animasyon: directionRef.current'e göre fromX belirle
  useGSAP(() => {
    const dir = directionRef.current || 1; // 1 veya -1
    const fromX = dir > 0 ? 100 : -100; // dir>0 -> içerik sağdan gelecek (xPercent: 100 -> 0)
    const outX = -fromX; // outgoing yön ters olabilir

    const tml = gsap.timeline();

    // Görsel için önce opacity 0 yapıp then fromTo ile getirme
    tml.fromTo(
      ".cocktail img",
      { xPercent: fromX, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 0.6, ease: "power1.inOut" },
      0,
    );

    // Başlık / detaylar için aynı yönden gelme
    tml.fromTo(
      ".info",
      { xPercent: fromX, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 0.5, ease: "power1.inOut" },
      0.05,
    );

    tml.fromTo(
      ".details",
      { xPercent: fromX, opacity: 0 },
      { xPercent: 0, opacity: 1, duration: 0.5, ease: "power1.inOut" },
      0.1,
    );

    // istersen eski içerik için çıkış animasyonu da ekleyebilirsin
    // (örnek: önceki içeriği hemen -quick- sola/sağa kaydırıp opacity 0 yap)
  }, [currentIndex]);

  return (
    <section id="menu" aria-labelledby="menu-heading">
      <img
        src="/images/slider-left-leaf.png"
        alt="left-leaf"
        id="m-left-leaf"
      />
      <img
        src="/images/slider-right-leaf.png"
        alt="right-leaf"
        id="m-right-leaf"
      />

      <h2 id="menu-heading" className="sr-only">
        Cocktail Menu
      </h2>

      <nav className="cocktail-tabs" aria-label="Cocktail Navigation">
        {allCocktails.map((cocktail, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={cocktail.id}
              className={
                isActive
                  ? "text-white border-white"
                  : "text-white-50 border-white/50"
              }
              onClick={() => goToSlide(index)} // tab'lerde direction otomatik hesaplanır
            >
              {cocktail.name}
            </button>
          );
        })}
      </nav>

      <div className="content">
        <div className="arrows">
          {/* Sol ok: önceki (geri) -> direction = -1 */}
          <button
            className="text-left"
            onClick={() => goToSlide(currentIndex - 1, -1)}
          >
            <span>{prevCocktail.name}</span>
            <img
              src="/images/right-arrow.png"
              alt="right-arrow"
              aria-hidden="true"
            />
          </button>

          {/* Sağ ok: sonraki (ileri) -> direction = +1 */}
          <button
            className="text-left"
            onClick={() => goToSlide(currentIndex + 1, 1)}
          >
            <span>{nextCocktail.name}</span>
            <img
              src="/images/left-arrow.png"
              alt="left-arrow"
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="cocktail">
          {/* key ile React yeni img'yi mount eder; animasyon güvenilir çalışır */}
          <img
            key={currentCocktail.id}
            src={currentCocktail.image}
            className="object-contain"
            alt={currentCocktail.name}
          />
        </div>

        <div className="recipe">
          <div ref={contentRef} className="info">
            <p>Recipe for:</p>
            <p id="title">{currentCocktail.name}</p>
          </div>
          <div className="details">
            <h2>{currentCocktail.title}</h2>
            <p>{currentCocktail.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;
