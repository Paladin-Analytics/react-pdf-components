import './image.module.scss';
import ReactPDF, {
  StyleSheet,
  Text as RPDFText,
  View as RPDFView,
  Image as RPDFImage,
  Link as RPDFLink,
} from '@react-pdf/renderer';
import { FunctionComponent } from 'react';
/**
 * Atticus Image Features
 *  - caption -> string
    - alignment
    - wrap
    - size -> percentage
    - link -> string
 * TODO
    study the page break behavior of react-pdf
 */

/* eslint-disable-next-line */
interface ImageCoreProps extends ReactPDF.ImageWithSrcProp {
  caption?: string;
  captionAlignment?: alignmentType;
  captionTextStyles?: ReactPDF.Styles;
  size?: number; //Percentage of parent element
  link?: string;
}
const IS_DEBUG = false;
function ImageCore({
  caption,
  captionAlignment = 'left',
  size,
  link,
  captionTextStyles,
  ...rPDFImageProps
}: ImageCoreProps) {
  const styles = StyleSheet.create({
    image: {
      width: '100%',
    },
    container: {
      width: `${size || 100}%`,
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      marginBottom: '10px',
      textAlign: captionAlignment,
    },
    caption: {
      width: '96%',
      fontStyle: 'italic',
      color: '#3568ba',
      textDecoration: 'none',
    },
  });

  return (
    <RPDFView style={[styles.container]} debug={IS_DEBUG}>
      <RPDFLink src={link || ''}>
        <RPDFImage
          debug={IS_DEBUG}
          style={[styles.image]}
          {...rPDFImageProps}
        />
        {caption && (
          <RPDFText
            debug={IS_DEBUG}
            style={[styles.caption, captionTextStyles ?? {}]}
          >
            {caption}
          </RPDFText>
        )}
      </RPDFLink>
    </RPDFView>
  );
}

type alignmentType = 'left' | 'center' | 'right';
interface ImageProps extends ImageCoreProps {
  alignment?: alignmentType;
  wrap?: boolean;
}

const alignmentToCSSMap: Record<
  alignmentType,
  'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline' | undefined
> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

export const Image: FunctionComponent<ImageProps> = ({
  alignment = 'left',
  wrap = false,
  ...coreImageProps
}) => {
  return wrap ? (
    // TODO implement the wrapping logic
    <RPDFView>
      <ImageCore captionAlignment={alignment} {...coreImageProps}></ImageCore>
    </RPDFView>
  ) : (
    <RPDFView
      wrap={false}
      debug={IS_DEBUG}
      style={{
        width: '100%',
        alignItems: alignmentToCSSMap[alignment],
      }}
    >
      <ImageCore captionAlignment={alignment} {...coreImageProps}></ImageCore>
    </RPDFView>
  );
};

export default Image;
