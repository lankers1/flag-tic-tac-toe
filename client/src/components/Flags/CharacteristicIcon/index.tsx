import {
  FaBan,
  FaBuilding,
  FaCircle,
  FaCross,
  FaCrown,
  FaGlobeAfrica,
  FaGlobeAmericas,
  FaGlobeAsia,
  FaGlobeEurope,
  FaKiwiBird,
  FaMoon,
  FaPen,
  FaStar,
  FaStarAndCrescent,
  FaStarHalfAlt,
  FaSun,
  FaTools
} from 'react-icons/fa';
import { FaGun, FaPerson, FaRotateRight, FaShieldHeart } from 'react-icons/fa6';
import { IoTriangle } from 'react-icons/io5';
import { BsSymmetryVertical } from 'react-icons/bs';
import { GiStarsStack } from 'react-icons/gi';
import { RiPlantFill, RiRectangleLine } from 'react-icons/ri';
import { TbBoxAlignTopLeftFilled, TbFocusCentered } from 'react-icons/tb';
import styles from './styles.module.scss';

interface CharacteristicIconProps {
  characteristic: string;
  type?: string;
}

export function CharacteristicIcon({
  characteristic,
  type
}: CharacteristicIconProps) {
  if (type === 'color') {
    return (
      <div
        className={`${styles.icon} ${styles[`${characteristic.slice(9)}Icon`]}`}
      />
    );
  }

  if (type === 'main_color') {
    return (
      <div
        className={`${styles.icon} ${
          styles[`${characteristic.slice(12)}Icon`]
        }`}
      />
    );
  }

  if (type === 'combo_colors') {
    return (
      <div
        className={styles.comboColorContainer}
        style={{
          width: `${12 + 8 * 2}px`
        }}
      >
        {characteristic?.split('_and_')?.map((color, i) => (
          <div
            key={`${type}-${color}-${i}`}
            className={`${styles.icon} ${styles.comboColor} ${
              styles[`${color}Icon`]
            }`}
            style={{
              right: `${i * 8}px`
            }}
          />
        ))}
      </div>
    );
  }

  switch (characteristic) {
    case 'Asia':
      return <FaGlobeAsia />;
    case 'Africa':
      return <FaGlobeAfrica />;
    case 'North America':
      return <FaGlobeAmericas />;
    case 'South America':
      return <FaGlobeAmericas />;
    case 'Europe':
      return <FaGlobeEurope />;
    case 'Oceania':
      return <FaGlobeAsia />;
    case 'contains_circle':
      return <FaCircle />;
    case 'contains_triangle':
      return <IoTriangle />;
    case 'line_symmetry':
      return <BsSymmetryVertical />;
    case 'rotational_symmetry':
      return <FaRotateRight />;
    case 'no_symmetry':
      return <FaBan />;
    case 'red_stars':
      return <FaStar className={styles.redStar} />;
    case 'white_stars':
      return <FaStar className={styles.whiteStars} />;
    case 'three_plus_stars':
      return <GiStarsStack />;
    case 'triband':
      return (
        <div className={`${styles.tribandContainer} ${styles.icon}`}>
          <div
            className={`${styles.tribandTopBand} ${styles.horizontalBand}`}
          />
          <div
            className={`${styles.tribandMiddleBand} ${styles.horizontalBand}`}
          />
          <div
            className={`${styles.tribandBottomBand} ${styles.banhorizontalBandd}`}
          />
        </div>
      );

    case 'horizontal_stripes':
      return (
        <div className={`${styles.horizontalStripe} ${styles.icon}`}>
          <div
            className={`${styles.horizontalBand} ${styles.horizontalMiddleBandStripe}`}
          />
        </div>
      );

    case 'three_horizontal_stripes':
      return (
        <div className={`${styles.threeHorizontalStripe} ${styles.icon}`}>
          <div className={`${styles.topStripe} ${styles.horizontalBand}`} />
          <div className={`${styles.middleStripe} ${styles.horizontalBand}`} />
          <div className={`${styles.bottomStripe} ${styles.horizontalBand}`} />
        </div>
      );

    case 'three_vertical_stripes':
      return (
        <div className={`${styles.threeVerticalStripe} ${styles.icon}`}>
          <div
            className={`${styles.verticalBand} ${styles.leftVerticalStripe}`}
          />
          <div
            className={`${styles.verticalBand} ${styles.middleVerticalStripe}`}
          />
          <div
            className={`${styles.verticalBand} ${styles.rightVerticalStripe}`}
          />
        </div>
      );

    case 'four_plus_horizontal_stripes':
      return (
        <div className={`${styles.fourHorizontalStripes} ${styles.icon}`}>
          <div className={`${styles.topStripe} ${styles.stripe}`} />
          <div className={`${styles.topMiddleStripe} ${styles.stripe}`} />
          <div className={`${styles.bottomMiddleStripe} ${styles.stripe}`} />
          <div className={`${styles.bottomStripe} ${styles.stripe}`} />
        </div>
      );

    case 'vertical_stripes':
      return (
        <div className={`${styles.verticalStripe} ${styles.icon}`}>
          <div className={`${styles.verticalBand} ${styles.middleStripe}`} />
        </div>
      );

    case 'two_vertical_stripes':
      return (
        <div className={`${styles.twoVerticalStripes} ${styles.icon}`}>
          <div className={styles.halfVerticalStripe} />
        </div>
      );

    case 'two_horizontal_stripes':
      return (
        <div className={`${styles.twoHorizontalStripes} ${styles.icon}`}>
          <div className={styles.halfHorizontalStripe} />
        </div>
      );

    case 'diagonal_stripes':
      return (
        <div className={`${styles.diagonalStripes} ${styles.icon}`}>
          <div className={styles.diagonalStripe} />
        </div>
      );
    case 'contains_moon':
      return <FaMoon />;
    case 'contains_sun':
      return <FaSun />;
    case 'yellow_stars':
      return <FaStar className={styles.yellowStars} />;
    case 'black_star':
      return <FaStar />;
    case 'bordered':
      return <RiRectangleLine />;
    case 'contains_canton':
      return <TbBoxAlignTopLeftFilled />;
    case 'contains_cross':
      return <FaCross />;
    case 'contains_headwear':
      return <FaCrown />;
    case 'contains_animal':
      return <FaKiwiBird />;
    case 'contains_coat_of_arms':
      return <FaShieldHeart />;
    case 'contains_plant':
      return <RiPlantFill />;
    case 'contains_weapon':
      return <FaGun />;
    case 'contains_tool':
      return <FaTools />;
    case 'contains_human':
      return <FaPerson />;
    case 'contains_building':
      return <FaBuilding />;
    case 'contains_writing':
      return <FaPen />;
    case 'centered_emblem':
      return <TbFocusCentered />;
    case 'moon_and_stars':
      return <FaStarAndCrescent />;
    case 'one_star':
      return <FaStarHalfAlt />;
  }
}
