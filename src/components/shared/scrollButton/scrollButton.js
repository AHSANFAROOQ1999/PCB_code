import React, { useState, useEffect } from 'react';
import { Icon } from 'semantic-ui-react';

import './scrollButton.scss';

const ScrollToTop = () => {
    const [showTopBtn, setShowTopBtn] = useState(false);
    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 230) {
                setShowTopBtn(true);
            } else {
                setShowTopBtn(false);
            }
        });
    }, []);
    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            <div className='effect'>
                {showTopBtn && (
                    <div className="scroll_btn">
                        <Icon name='chevron up' onClick={goToTop} />
                    </div>
                )}
            </div>
        </>
    );
};
export default ScrollToTop;