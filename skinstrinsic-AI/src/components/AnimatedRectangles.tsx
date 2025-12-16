import rectangleSmall from '../assets/rectangle-small.svg';
import rectangleMedium from '../assets/rectangle-medium.svg';
import rectangleBig from '../assets/rectangle-big.svg';

interface AnimatedRectanglesProps {
  containerClass?: string;
  sizes?: { big: string; medium: string; small: string };
}

function AnimatedRectangles({ 
  containerClass = '', 
  sizes = { big: '600px', medium: '500px', small: '400px' }
}: AnimatedRectanglesProps) {
  const rectangleStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    height: 'auto'
  };

  return (
    <>
      <img 
        src={rectangleBig} 
        alt="Big rectangle"
        className={containerClass ? `${containerClass}-big` : ''}
        style={{
          ...rectangleStyle,
          zIndex: 1,
          width: sizes.big,
          animation: 'rotateFast 20s linear infinite'
        }}
      />
      <img 
        src={rectangleMedium} 
        alt="Medium rectangle"
        className={containerClass ? `${containerClass}-medium` : ''}
        style={{
          ...rectangleStyle,
          zIndex: 2,
          width: sizes.medium,
          animation: 'rotateMedium 30s linear infinite'
        }}
      />
      <img 
        src={rectangleSmall} 
        alt="Small rectangle"
        className={containerClass ? `${containerClass}-small` : ''}
        style={{
          ...rectangleStyle,
          zIndex: 3,
          width: sizes.small,
          animation: 'rotateSlow 40s linear infinite'
        }}
      />
    </>
  );
}

export default AnimatedRectangles;
