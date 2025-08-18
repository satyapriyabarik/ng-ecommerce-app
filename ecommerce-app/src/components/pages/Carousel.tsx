import React from 'react';

const Carousel = () => {
    return (
        <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src="src/assets/images/slide-1.jpeg" className="d-block w-100" alt="Slide 1" />
                    <div className="carousel-caption d-none d-md-block">
                        <h3 className="animate__animated animate__fadeInDown animate__flip">Welcome to Our Store</h3>
                        <p className="animate__animated animate__fadeInUp">Best products at unbeatable prices</p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="src/assets/images/slide-2.jpg" className="d-block w-100" alt="Slide 2" />
                    <div className="carousel-caption d-none d-md-block">
                        <h3 className="animate__animated animate__fadeInDown">Welcome to Our Store</h3>
                        <p className="animate__animated animate__fadeInUp">Best products at unbeatable prices</p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="src/assets/images/slide-3.jpg" className="d-block w-100" alt="Slide 3" />
                    <div className="carousel-caption d-none d-md-block">
                        <h3 className="animate__animated animate__fadeInDown">Welcome to Our Store</h3>
                        <p className="animate__animated animate__fadeInUp">Best products at unbeatable prices</p>
                    </div>
                </div>
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true" />
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true" />
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
};

export default Carousel;
