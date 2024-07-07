import React, { useState, useEffect } from 'react';
import './App.css';
import Arrow from './icons/Arrow';
import { bear, coin, highVoltage, notcoin, rocket, trophy } from './images';

const App = () => {
  const [points, setPoints] = useState(2); // Состояние для очков
  const [energy, setEnergy] = useState(1000); // Состояние для энергии
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]); // Состояние для хранения кликов мыши
  const [animate, setAnimate] = useState(false); // Состояние для анимации notcoin

  const pointsToAdd = 1; // Количество добавляемых очков при клике
  const energyToReduce = 1; // Количество уменьшаемой энергии при клике

  // Обработчик клика по элементу
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (energy - energyToReduce < 0) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Увеличиваем очки и уменьшаем энергию
    setPoints(points + pointsToAdd);
    setEnergy(energy - energyToReduce < 0 ? 0 : energy - energyToReduce);

    // Добавляем клик в массив
    setClicks([...clicks, { id: Date.now(), x, y }]);
    // Запускаем анимацию notcoin
    setAnimate(true);
    // Сбрасываем анимацию
    setTimeout(() => setAnimate(false), 60); // 300ms - продолжительность анимации
  };

  // Обработчик завершения анимации
  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id)); // Удаляем клик из массива по его id
  };

  // useEffect хук для восстановления энергии с течением времени
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + 1, 1000)); // Восстанавливаем энергию на 1 каждые 1000 мс (1 энергия в секунду)
    }, 1000);

    return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
  }, []);

  // Возвращаем JSX элементы
  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">
      {/* Фоновое видео */}
      <video className="video-background" autoPlay loop muted playsInline>
      <source src="/video/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Фоновые элементы */}
      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>

      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">
        {/* Верхняя часть экрана */}
        <div className="fixed top-0 left-0 w-full px-4 pt-8 z-10 flex flex-col items-center text-white">
          <div className="w-full cursor-pointer">
            <div className="bg-[#1f1f1f] text-center py-2 rounded-xl">
              <p className="text-lg">
                TopTapix <Arrow size={18} className="ml-0 mb-1 inline-block" />
              </p>
            </div>
          </div>
          <div className="mt-12 text-5xl font-bold flex items-center">
            <img src={coin} width={44} height={44} />
            <span className="ml-2">{points.toLocaleString()}</span>
          </div>
          <div className="text-base mt-2 flex items-center">
            <img src={trophy} width={24} height={24} />
            <span className="ml-1">
              Gold <Arrow size={18} className="ml-0 mb-1 inline-block" />
            </span>
          </div>
        </div>

        {/* Нижняя часть экрана */}
        <div className="fixed bottom-0 left-0 w-full px-4 pb-4 z-10">
          <div className="w-full flex justify-between gap-2">
            <div className="w-1/3 flex items-center justify-start max-w-32">
              <div className="flex items-center justify-center">
                <img src={highVoltage} width={44} height={44} alt="High Voltage" />
                <div className="ml-2 text-left">
                  <span className="text-white text-2xl font-bold block">{energy}</span>
                  <span className="text-white text-large opacity-75">/ 1000</span>
                </div>
              </div>
            </div>
            <div className="flex-grow flex items-center max-w-60 text-sm">
              <div className="w-full bg-[#fad258] py-4 rounded-2xl flex justify-around">
                {/* Кнопки */}
                <button className="flex flex-col items-center gap-1">
                  <img src={bear} width={24} height={24} alt="High Voltage" />
                  <span>Frens</span>
                </button>
                <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                <button className="flex flex-col items-center gap-1">
                <img src={coin} width={24} height={24} alt="High Voltage" />
                  <span>Earn</span>
                </button>
                <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                <button className="flex flex-col items-center gap-1">
                  <img src={rocket} width={24} height={24} alt="High Voltage" />
                  <span>Boosts</span>
                </button>
              </div>
            </div>
          </div>
          {/* Полоса прогресса для отображения уровня энергии */}
          <div className="w-full bg-[#f9c035] rounded-full mt-4">
            <div
              className="bg-gradient-to-r from-[#f3c45a] to-[#fffad0] h-4 rounded-full"
              style={{ width: `${(energy / 1000) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Центральная часть экрана с изображением и кликами */}
        <div className="flex-grow flex items-center justify-center">
          <div className="relative mt-4" onClick={handleClick} style={{ touchAction: 'none' }}>
            <img
              src={notcoin}
              width={400}
              height={400}
              alt="notcoin"
              className={animate ? 'notcoin-animate' : ''}
              style={{ transformOrigin: 'center' }}
            />
            {/* Отображаем анимацию при клике */}
            {clicks.map((click) => (
              <div
                key={click.id}
                className="absolute text-5xl font-bold opacity-0"
                style={{
                  top: `${click.y - 42}px`,
                  left: `${click.x - 28}px`,
                  animation: `float 0.5s ease-out`,
                  transformOrigin: `${click.x < 128 ? 'right' : 'left'} ${click.y < 128 ? 'bottom' : 'top'}`,
                }}
                onAnimationEnd={() => handleAnimationEnd(click.id)}
              >
                +{pointsToAdd}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
