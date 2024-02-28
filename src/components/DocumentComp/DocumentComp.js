import React, { useState, useEffect, useRef } from 'react'
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import html2canvas from "html2canvas";
import { weekdays, organisations, location, weapons } from '../../utils/constant'
import MagnifierComp from '../magnifier/Magnifier';
import DocAnnotation from '../annotation/DocAnnotation';
import JSZip from "jszip";

const DocumentComp = ({ scale, docMagnifierSec, brightness, docAnnotationSec, setBrightness, rangSetting, setDocMagnifierSec }) => {
    const [annotations, setAnnotations] = useState([]);
    const [annotation, setAnnotation] = useState({});
    const [searchResult, setSearchResult] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFileType, setSelectedFileType] = useState("docx");
    const [selectedFileContent, setSelectedFileContent] = useState("");
    const [scrollPosition, setScrollPosition] = useState(0);
    const annotationStackRef = useRef([]);
    const weekdaysPattern = weekdays.join("|");
    const weekdaysRegex = new RegExp(weekdaysPattern, "gi");
    const organisationsPattern = organisations.join("|");
    const organisationsRegex = new RegExp(organisationsPattern, "gi");
    const weaponsPattern = weapons.join("|");
    const weaponsRegex = new RegExp(weaponsPattern, "gi");
    const annotWrapper = {
        position: "absolute",
        top: "0px",
        left: "0px",
        right: "0px",
        bottom: "0px",
        zIndex: 1,
        transform: `scale(1)`,
    };
    const onChange = (annotation) => {
        setAnnotation(annotation);
    };

    const onSubmit = (annotation) => {
        const { geometry, data } = annotation;
        setAnnotations(
            annotations.concat({
                geometry,
                data: {
                    ...data,
                    id: Math.random(),
                },
            })
        );
        annotationStackRef.current = [];
    };
    const handleBrightnessChange = (event) => {
        setBrightness(event.target.value);
    };

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleSearch = () => {
        if (selectedFileType === "docx") {
            const searchWords = [searchTerm];
            const content = removeHtmlTags(selectedFileContent);
            setSearchResult(searchWords);
        }
    };
    const removeHtmlTags = (html) => {
        return html.replace(/<\/?[^>]+(>|$)/g, " ");
    };
    const scrollUp = () => {
        if (scrollPosition !== 0)
          setScrollPosition(scrollPosition - 680);
      }; const scrollDown = () => {
        setScrollPosition(scrollPosition + 680);
      };
    function highlightWeekdays(text) {
        return text.replace(
            weekdaysRegex,
            `<span style="background-color: #8bc43f; ">$&<button class="date-button" style="font-size: 10px; padding: 0px 3px;position: relative;
          top: -3px;border: 0.5px solid #000;border-radius: 3px;line-height: 17px;">DATE</button></span>`
        );
    }

    function highlightOrganisations(text) {
        return text.replace(
            organisationsRegex,
            `<span style="background-color: orange; ">$&<button class="org-button" style="font-size: 10px; padding: 0px 3px;position: relative;
          top: -3px;border: 0.5px solid #000;border-radius: 3px;line-height: 17px; margin-left: 2px;">ORG</button></span>`
        );
    }

    function highlightWeapons(text) {
        return text.replace(
            weaponsRegex,
            `<span style="background-color: skyblue; ">$&<button class="weapon-button" style="font-size: 10px; padding: 0px 3px;position: relative;
            top: -3px;border: 0.5px solid #000;border-radius: 3px; line-height: 17px; margin-left:2px">WEAPON</button></span>`
        );
    }

    function highlightText(text) {
        let highlightedText = text;
        searchResult.forEach((result) => {
            const regex = new RegExp(result, "gi");
            highlightedText = highlightedText.replace(
                regex,
                `<span style="background-color: yellow;  border: 1px solid black;">$&</span>
            `
            );
        });

        return highlightedText;
    }

    function convertXmlToHtml(xmlContent) {
        return xmlContent.replace(/<p>/g, "<div>").replace(/<\/p>/g, "</div>");
    }
    const loadDefaultDocx = async () => {
        try {
            const defaultDocxUrl = process.env.PUBLIC_URL + "/ABC.docx";
            const response = await fetch(defaultDocxUrl);

            if (!response.ok) {
                throw new Error(`Failed to fetch the file. Status: ${response.status}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const zip = new JSZip();
            const zipData = await zip.loadAsync(arrayBuffer);

            const contentXml = await zipData
                .file("word/document.xml")
                .async("string");

            const htmlContent = convertXmlToHtml(contentXml);

            setSelectedFileType("docx");
            setSelectedFileContent(htmlContent);
        } catch (error) {
            console.error("Error loading default DOCX file:", error);
        }
    };

    if (!selectedFileContent) {
        loadDefaultDocx();
    }

    // doc margnifier code
    const docRef = useRef(null);
    const [docImageSrc, setDocImageSrc] = useState(null);

    const handleConvertToImage = () => {
        if (docRef.current) {
            html2canvas(docRef.current)
                .then((canvas) => {
                    const imgData = canvas.toDataURL("image/png");
                    setDocImageSrc(imgData);
                })
                .catch((error) => {
                    console.error("Error converting div to image:", error);
                });
        }
    };

    useEffect(() => {
        console.log('scroll pos', scrollPosition)

        if (docMagnifierSec) {
            setDocMagnifierSec(false);
            setTimeout(() => {
                const myDiv = docRef.current;
                if (myDiv) {
                    myDiv.scrollTop = scrollPosition;
                }
                handleConvertToImage();
            }, [0]);

            setTimeout(() => {
                setDocMagnifierSec(true);
            }, [0]);

        } else {
            const myDiv = docRef.current;
            if (myDiv) {
                myDiv.scrollTop = scrollPosition;
            }
        }
    }, [scrollPosition]);

    useEffect(() => { handleConvertToImage(); }, [])

    return (
        <div className="pdf_rel">
            {selectedFileType === "image" && (
                <div>
                    <image
                        src={selectedFileContent}
                        alt="Selected Image"
                        className="imgSelected"
                    />
                </div>
            )}
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                    gap: "5px",
                }}
            >
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                />
                <input
                    type="button"
                    value="Search"
                    onClick={() => {
                        if (searchTerm.trim() !== "") {
                            handleSearch();
                        }
                    }}
                />
            </div>
            <div
                className="content_show_hide"
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    height: "100%",
                    margin: "20px 0px",
                    overflow: "auto",
                }}
            >
                <div className="prev_icon scroll_comman">
                    <ArrowBackIosIcon onClick={scrollUp} />
                </div>
                {selectedFileType === "docx" && (
                    <div
                        style={{
                            width: "45vw",
                            height: "75vh",
                            overflow: "hidden",
                            margin: "8px auto",
                        }}
                    >
                        <div
                            className="docSelected"
                            ref={docRef}
                            style={{
                                width: "100%",
                                height: "100%",
                                marginBottom: "20px",
                                borderRadius: "8px",
                                position: "relative",
                                transform: `scale(${scale})`,
                            }}
                        >
                            {!docMagnifierSec ? (
                                <div
                                    style={{
                                        width: "100%",
                                        border: "1px solid #ccc",
                                        borderRadius: "8px",
                                        padding: "0px 10px",
                                        background: "#fff",
                                        textAlign: "justify",
                                        filter: `brightness(${brightness}%)`,
                                        lineHeight: "34px"

                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: highlightWeapons(
                                            highlightOrganisations(
                                                highlightWeekdays(
                                                    highlightText(
                                                        removeHtmlTags(selectedFileContent)
                                                    )
                                                )
                                            )
                                        ),
                                    }}
                                />
                            ) : (
                                <MagnifierComp url={docImageSrc} />
                            )}

                            {docAnnotationSec && (
                                <div style={annotWrapper}>
                                    <DocAnnotation
                                        annotations={annotations}
                                        value={annotation}
                                        onChange={onChange}
                                        onSubmit={onSubmit}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <div className="next_icon scroll_comman">
                    <ArrowForwardIosIcon onClick={scrollDown} />
                </div>
            </div>
            {rangSetting && (
                <input
                    style={{
                        bottom: 10,
                        left: 10,
                        zIndex: 10,
                        position: "absolute",
                    }}
                    type="range"
                    id="brightnessRange"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={handleBrightnessChange}
                />
            )}
        </div>
    )
}

export default DocumentComp