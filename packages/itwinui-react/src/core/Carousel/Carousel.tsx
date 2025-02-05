/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';
import cx from 'classnames';
import {
  getRandomValue,
  useMergedRefs,
  Box,
  useLatestRef,
} from '../utils/index.js';
import type { PolymorphicForwardRefComponent } from '../utils/index.js';
import { CarouselContext } from './CarouselContext.js';
import { CarouselSlider } from './CarouselSlider.js';
import { CarouselSlide } from './CarouselSlide.js';
import { CarouselDotsList } from './CarouselDotsList.js';
import { CarouselDot } from './CarouselDot.js';
import { CarouselNavigation } from './CarouselNavigation.js';

type CarouselProps = {
  /**
   * Index of the currently shown slide.
   * Can be used to set the default index or control the active slide programmatically.
   * @default 0
   */
  activeSlideIndex?: number;
  /**
   * Callback fired when the current slide changes.
   */
  onSlideChange?: (index: number) => void;
};

const CarouselComponent = React.forwardRef((props, ref) => {
  const {
    activeSlideIndex: userActiveIndex = 0,
    onSlideChange,
    className,
    children,
    ...rest
  } = props;

  // Generate a stateful random id if not specified
  const [id] = React.useState(
    () => props.id ?? `iui-carousel-${getRandomValue(10)}`,
  );

  const isManuallyUpdating = React.useRef(false);
  const carouselRef = React.useRef<HTMLElement>(null);
  const refs = useMergedRefs(carouselRef, ref);

  const [currentIndex, setCurrentIndex] = React.useState(userActiveIndex);

  const scrollToSlide = React.useRef<
    (index?: number, options?: { instant?: boolean }) => void
  >(() => {}); // stub function populated in CarouselSlider

  const justMounted = React.useRef(true);
  React.useEffect(() => {
    setCurrentIndex(userActiveIndex);
    scrollToSlide.current(userActiveIndex, {
      instant: justMounted.current,
    });

    // re-focus the carousel for keyboard nav, but not on first mount
    // because it shows outline and might interfere with other components
    if (!justMounted.current) {
      carouselRef.current?.focus({ preventScroll: true });
    }

    justMounted.current = false;
  }, [userActiveIndex]);

  const [slideCount, setSlideCount] = React.useState(0);

  const [keysPressed, setKeysPressed] = React.useState<Record<string, boolean>>(
    {},
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    const key = event.key;
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      setKeysPressed((old) => ({ ...old, [key]: true }));
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft': {
        setKeysPressed((old) => ({ ...old, ArrowLeft: false }));
        const prevIndex = (slideCount + currentIndex - 1) % slideCount;
        scrollToSlide.current(prevIndex);
        setCurrentIndex(prevIndex);
        break;
      }
      case 'ArrowRight': {
        setKeysPressed((old) => ({ ...old, ArrowRight: false }));
        const nextIndex = (slideCount + currentIndex + 1) % slideCount;
        scrollToSlide.current(nextIndex);
        setCurrentIndex(nextIndex);
        break;
      }
    }
  };

  const userOnSlideChange = useLatestRef(onSlideChange);
  React.useEffect(() => {
    userOnSlideChange.current?.(currentIndex);
  }, [userOnSlideChange, currentIndex]);

  return (
    <Box
      as='section'
      aria-roledescription='carousel'
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      ref={refs}
      className={cx('iui-carousel', className)}
      {...rest}
      id={id}
    >
      <CarouselContext.Provider
        value={{
          currentIndex,
          setCurrentIndex,
          slideCount,
          setSlideCount,
          keysPressed,
          idPrefix: id,
          isManuallyUpdating,
          scrollToSlide,
        }}
      >
        {children}
      </CarouselContext.Provider>
    </Box>
  );
}) as PolymorphicForwardRefComponent<'section', CarouselProps>;

/**
 * The Carousel component consists of a set of slides, normally displayed one at a time. A navigation section is
 * located below the slides, consisting of "dots" and "previous"/"next" buttons, used for changing slides.
 *
 * The currently shown slide can also be changed using the left/right arrow keys or by dragging on a touch device.
 *
 * This component uses a composition approach so it should be used with the provided subcomponents.
 *
 * @example
 * <Carousel>
 *   <Carousel.Slider>
 *     <Carousel.Slide>...</Carousel.Slide>
 *     <Carousel.Slide>...</Carousel.Slide>
 *     <Carousel.Slide>...</Carousel.Slide>
 *   </Carousel.Slider>
 *   <Carousel.Navigation />
 * </Carousel>
 */
export const Carousel = Object.assign(CarouselComponent, {
  Slider: CarouselSlider,
  Slide: CarouselSlide,
  Navigation: CarouselNavigation,
  DotsList: CarouselDotsList,
  Dot: CarouselDot,
});

export default Carousel;
