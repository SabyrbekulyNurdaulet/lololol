import './MainPanel.css'

import React, { useState, useEffect, useRef } from 'react'
import { useSnapCarousel } from 'react-snap-carousel'

export default function MainPanel() {
  const [itms, setItms] = useState([])
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/items')
    .then(res => res.json())
    .then(data => setItms(data))
    .catch(error => console.log(error))
  })

  const slidesContainerRef = useRef(null)
  const slideRef = useRef(null)

  const handleNextButtonClick = () => {
    const slideWidth = slideRef.current.clientWidth;
    slidesContainerRef.current.scrollLeft += slideWidth;
  };

  const handlePrevButtonClick = () => {
    const slideWidth = slideRef.current.clientWidth;
    slidesContainerRef.current.scrollLeft -= slideWidth;
  };

  const itemsRef = useRef(null);

  const { scrollRef: itemsScrollRef, pages: itemsPages, activePageIndex: itemsActivePageIndex, next: itemsNext, prev: itemsPrev, goTo:itemsGoTo } =
    useSnapCarousel({ ref: itemsRef });

  const toggleDisplay = () => {
    setIsHidden(!isHidden);
  };
      
  return (
    <div className='Main'>
      <section className="slider-wrapper">
        <button className="slide-arrow" id="slide-arrow-prev" onClick={handlePrevButtonClick}>&#8249;</button>
        <button className="slide-arrow" id="slide-arrow-next" onClick={handleNextButtonClick}>&#8250;</button>
        <ul className="slides-container" id="slides-container" ref={slidesContainerRef}>
        <li className="slide">
            <div className='slide-text' ref={slideRef}>
              <nav>Гитары лучшего качества!</nav>
            </div>
          </li>
          <li className="slide">
            <div className='slide-text'>
              <nav>Выгодная цена!</nav>
            </div>
          </li>
          <li className="slide">
            <div className='slide-text'>
              <nav>Огромный выбор!</nav>
            </div>
          </li>
        </ul>
      </section>

        <div className='category'>
          <div className='category-slider'>
            <button className='slider-tick' onClick={() => itemsPrev()}>&#8249;</button>
            <ul
            ref={itemsScrollRef}
            style={{
              display: 'flex',
              overflow: 'auto',
              scrollSnapType: 'x mandatory'
            }}
            >
            {itms.map(itm => (
              <div key={itm._id} className='book'>
                <img src={require(`../images/items/${itm.img}`)} />
                <nav><b>{itm.title}</b></nav>
              </div>
            ))}
            </ul>
            <button className='slider-tick' onClick={() => itemsNext()}>&#8250;</button>
          </div>
          <div className='movements'>
            <ol style={{ display: 'flex' }}>
              {itemsPages.map((_, i) => (
                  <button className='slider-button'
                    style={i === itemsActivePageIndex ? { backgroundColor: '#E9E9E9' } : {}}
                    onClick={() => itemsGoTo(i)}
                  >
                  </button>
              ))}
            </ol>
            <div className='slider-tick'>
            </div>
          </div>
        </div>

      <button onClick={toggleDisplay} className='toggleDisplay'>Показать всё</button>
      <div className='catalog' style={{ display: isHidden ? 'none' : 'grid' }}>
        {itms.map(itm => (
          <div key={itm._id} className='book'>
          <img src={require(`../images/items/${itm.img}`)} />
            <nav><b>{itm.title}</b></nav>
          </div>
        ))}
      </div>
  </div>
  )
}
