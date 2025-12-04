import { ASSETS } from '~/constants/path';

type PropsType = {
    img?: string;
    alt?: string;
    lazy?: boolean;
    classN?: string;
};

export const SvgComponent = ({ img, alt = "icon", lazy, classN }: PropsType) => {
    if (!img) return null;
    
    const src = `${ASSETS}/svg/${img}.svg`;
    
    return (
        <img
            loading={lazy ? "lazy" : "eager"}
            className={`icon ${classN ? classN : ''}`}
            src={src}
            alt={alt}
        />
    );
};
