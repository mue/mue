import { Carousel } from '../../components/Elements/Carousel';

const PhotosTab = ({ photos }) => {
  return (
    <div className="carousel">
      <div className="carousel_container">
        <Carousel data={photos} />
      </div>
    </div>
  );
};

export default PhotosTab;
