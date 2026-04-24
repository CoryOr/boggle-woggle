import "./Pages.css";
import "./StorePage.css";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AudioContext } from "../contexts/AudioContext/AudioContextContext";

export default function StorePage() {
  const nav = useNavigate();
  const { playSfx } = useContext(AudioContext);
  const [showQr, setShowQr] = useState(false);

  const goHome = () => {
    playSfx("/sounds/click.wav");
    nav("/");
  };

  const openQr = () => {
    playSfx("/sounds/click.wav");
    setShowQr(true);
  };

  const closeQr = () => {
    playSfx("/sounds/click.wav");
    setShowQr(false);
  };

  return (
    <>
      <button className="stats-back-btn store-back-btn" onClick={goHome}>
        <div className="stats-back-arrow">←</div>
        BACK
      </button>

      <main className="store-page">
        <h1 className="store-title">WELCOME TO THE STORE!</h1>

        <div className="store-items">
          <div className="store-item">
            <img src="/BingBong.png" alt="Mr. Bing Bong" className="store-item-img bingbong-img" />
            <h2>MR. BING BONG</h2>
            <button className="store-price-btn" onClick={openQr}>$499.99</button>
          </div>

          <div className="store-item">
            <img src="/Scout.png" alt="Scout" className="store-item-img scout-img" />
            <h2>SCOUT</h2>
            <button className="store-price-btn" onClick={openQr}>$249.99</button>
          </div>
        </div>
      </main>

      {showQr && (
        <div className="qr-overlay" onClick={closeQr}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <button className="qr-close-btn" onClick={closeQr}>×</button>
            <h2>Scan to Pay</h2>
            <img src="/ZelleQR.jpg" alt="Zelle QR code" className="qr-image" />
          </div>
        </div>
      )}
    </>
  );
}