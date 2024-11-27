import { FunctionComponent, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

interface RatingProps {
  value?: number;
  size?: 30 | number;
  onChange?: (value: number) => void;
  isToDisplay?: boolean;
  className?: string;
}

const Rating: FunctionComponent<RatingProps> = ({
  value = 0,
  onChange,
  size,
  isToDisplay,
  className,
}) => {
  const [hover, setHover] = useState<number | null>(null);

  const handleClick = (newValue: number) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`flex w-auto justify-center  ${className || ""}`}>
      {Array.from({ length: 5 }, (_, index) => {
        const ratingValue = index + 1;
        return (
          <span
            key={index}
            onClick={() => handleClick(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
          >
  
                {ratingValue <= value ? (
                  <AiFillStar
                    size={size ? size : 30}
                    className="text-[#F4D11B]"
                  />
                ) : (
                  <AiOutlineStar
                    size={size ? size : 30}
                    className="text-[#F4D11B]"
                  />
                )}
           
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
