import { Viewer } from '@paladin-analytics/react-pdf-components';
import ReactPDF, {
  Document,
  Font,
  pdf,
  PDFViewer,
} from '@paladin-analytics/rpdf-renderer';
import {
  createElement,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import styles from './app.module.scss';
import ComponentPreviews from './components';
import { editorFonts } from './fonts';

editorFonts.forEach((el) => {
  Font.register(el);
});
interface WithPDFViewerProps extends ReactPDF.PDFViewerProps {
  documentProps?: ReactPDF.DocumentProps;
}

const WithPDFViewer: React.FC<WithPDFViewerProps> = ({
  children,
  documentProps,
  ...pdfViewerProps
}) => {
  return (
    <PDFViewer width={'100%'} height={'100%'} {...pdfViewerProps}>
      <Document {...documentProps}>{children}</Document>
    </PDFViewer>
  );
};

export function App() {
  const [isNew, setIsNew] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [PDFUrl, setPDFUrl] = useState('');
  const [viewLabel, setViewLabel] = useState('');

  const routes = useMemo(() => {
    const r = [];
    for (const [key, value] of Object.entries(ComponentPreviews)) {
      r.push({
        label: key,
        component: value,
      });
    }
    return r;
  }, []);

  const setPDFBlobUrl = async (parsedChapter: ReactElement) => {
    const withDocumentWrapper = createElement(Document, {}, parsedChapter);
    const blob = await pdf(withDocumentWrapper).toBlob();
    const url = URL.createObjectURL(blob);
    setPDFUrl(url);
  };

  useEffect(() => {
    setPDFUrl('');
    if (!isNew) return;
    const route = routes.find((r) => r.label === viewLabel);
    if (!route) return;
    setPDFBlobUrl(route.component.default({}) as ReactElement);
  }, [isNew, routes, viewLabel]);

  useEffect(() => {
    setViewLabel(routes[0].label);
  }, [routes]);

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const handleChange = (e: any) => {
    setIsNew(e.target.value === 'new');
  };

  const handleLinkPress = (label: string) => {
    setViewLabel(label);
  };
  
  return (
    <Router>
      <div className={styles.app}>
        <nav>
          <ul>
            {routes.map((r) => (
              <li key={r.label}>
                <Link
                  to={`${r.label}-prev`}
                  onClick={handleLinkPress.bind(null, r.label)}
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <form>
          <input
            type="radio"
            name="previewer"
            value="old"
            onChange={handleChange}
          />
          Old
          <input
            type="radio"
            name="previewer"
            value="new"
            onChange={handleChange}
          />
          New
        </form>
        <Switch>
          {routes.map((r) => (
            <Route
              key={r.label}
              path={`/${r.label}-prev`}
              render={() => {
                if (isNew) {
                  return (
                    <>
                      <button
                        onClick={() => {
                          if (currentPage > 1)
                            setCurrentPage((prev) => prev - 1);
                        }}
                      >
                        Prev page
                      </button>
                      <button
                        onClick={() => {
                          if (currentPage < totalPages)
                            setCurrentPage((prev) => prev + 1);
                        }}
                      >
                        Next page
                      </button>
                      <div>
                        <Viewer
                          url={PDFUrl}
                          currentPage={currentPage}
                          onLoadSuccess={(doc) => setTotalPages(doc.numPages)}
                          style={{
                            transform: 'scale(0.7)',
                            boxShadow: '0px 0px 8px 2px rgba(0,0,0,0.42)',
                            width: 'max-content',
                          }}
                        />
                      </div>
                    </>
                  );
                }
                return (
                  <WithPDFViewer>
                    {r.component.default({}) as ReactElement}
                  </WithPDFViewer>
                );
              }}
            ></Route>
          ))}
          <Route path="/"></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
