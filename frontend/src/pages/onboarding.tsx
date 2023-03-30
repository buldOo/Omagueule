import Globe from 'globe.gl';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/scss/index.scss';

const Onboarding = () => {
  const ref = useRef(null);
  const [username, setUsername] = useState('')

  const navigate = useNavigate();

  useEffect(() => {
    // Gen random data
    const N = 10;
    const arcsData = [...Array(N).keys()].map(() => ({
      startLat: (Math.random() - 0.5) * 180,
      startLng: (Math.random() - 0.5) * 360,
      endLat: (Math.random() - 0.5) * 180,
      endLng: (Math.random() - 0.5) * 360,
      color: [['#00a389', '#FFBD59', 'blue', '#F53131'][Math.round(Math.random() * 3)], ['#00a389', '#FFBD59', 'blue', '#F53131'][Math.round(Math.random() * 3)]]
    }));

    fetch('../src/assets/images/country.geojson')
      .then(res => res.json())
      .then(countries => {
        const world = Globe()
          .globeImageUrl('../src/assets/images/transparent.png')
          .hexPolygonsData(countries.features)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.3)
          .hexPolygonColor(() => `#00a389`)
          .arcsData(arcsData)
          .arcColor('color')
          .arcDashLength(1)
          .arcDashGap(2)
          .arcDashAnimateTime(() => Math.random() * 4000 + 500)
          .backgroundColor("#00000000")
          .enablePointerInteraction(false)
          (ref.current!)
      });
  }, []);

  const handleCLick = () => navigate('/', { state: { username } })

  return (
    <div className="landing">
      <div className="curtain">
        <img src="../src/assets/images/Ohmesgueul.png" alt="Logo" />
      </div>
      <div className="background" ref={ref}></div>
      <div className="form-container">
        <img className="meteorOne" src="../src/assets/images/meteor.gif" alt="meteor" />
        <img className="meteorTwo" src="../src/assets/images/meteor.gif" alt="meteor" />
        <img className="meteorTree" src="../src/assets/images/meteor.gif" alt="meteor" />
        <div className="title">
          <img src="../src/assets/images/Ohmesgueul2.png" alt="Logo" />
          <h1>Omesgueules !</h1>
        </div>
        <div className="form">
          <form action="#">
            <h2>Votre petit nom</h2>
            <div className="login_button">
              <input type="text" name="name" placeholder='nom' value={username} onChange={e => setUsername(e.target.value)} />
              <button disabled={username === ''} onClick={handleCLick}>
                <img src="../src/assets/images/Send.png" alt="Send icons" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Onboarding;