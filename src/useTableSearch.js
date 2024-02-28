
import { useState, useEffect } from "react";

export const useTableSearch = ({ searchVal, retrieve, inputJson }) => {
    const [filteredData, setFilteredData] = useState([]);
    const [origData, setOrigData] = useState([]);
    const [searchIndex, setSearchIndex] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const crawl = (user, allValues) => {
            if (!allValues) allValues = [];
            for (var key in user) {
                if (typeof user[key] === "object") crawl(user[key], allValues);
                else allValues.push(user[key] + " ");
            }
            return allValues;
        };
        const fetchData = async () => {
            //   const { data: users } = await retrieve();
           const inputJson=[
            [{
              "root": "project one",
              "task": "task one",
              "data": [{
                "id": 1,
                "name": "folder one",
                "image": "image01",
                "status": "Review",
                "TypeOfBoundingBox": "Rectangle",
                "numberOfBoundingBox": "10",
                "annotationStatus": "review"
              }, {
                "id": 2,
                "name": "folder one",
                "image": "image02",
                "status": "Review",
                "TypeOfBoundingBox": "Rectangle",
                "numberOfBoundingBox": "10",
                "annotationStatus": "review"
              }, {
                "id": 3,
                "name": "folder two",
                "image": "image22",
                "status": "Review",
                "TypeOfBoundingBox": "Rectangle",
                "numberOfBoundingBox": "10",
                "annotationStatus": "todo"
              }]
            },
            {
              "root": "project two",
              "task": "task two",
              "data": [{
                "id": 1,
                "name": "folder three",
                "image": "image01",
                "status": "Review",
                "TypeOfBoundingBox": "Rectangle",
                "numberOfBoundingBox": "14",
                "annotationStatus": "todo"
              }, {
                "id": 2,
                "name": "folder four",
                "image": "image02",
                "status": "Review",
                "TypeOfBoundingBox": "Rectangle",
                "numberOfBoundingBox": "10",
                "annotationStatus": "reviewed"
              }, {
                "id": 3,
                "name": "folder four",
                "image": "image22",
                "status": "Review",
                "TypeOfBoundingBox": "Rectangle",
                "numberOfBoundingBox": "10",
                "annotationStatus": "reviewed"
              }]
            }]
          ]; 
            const nameMap = new Map();
            console.log(inputJson)
            // Process the original JSON data to populate the map
            inputJson[0].forEach(project => {
                const projectName = project.root;
                project.data.forEach(item => {
                    const name = `${projectName} - ${item.name}`;
                    // const name = item.name;
                    // const numberOfBoundingBox = item.numberOfBoundingBox;
                    const numberOfBoundingBox = parseInt(item.numberOfBoundingBox);

                    if (nameMap.has(name)) {
                        const existing = nameMap.get(name);
                        nameMap.set(name, {
                            projectName: projectName,
                            name: name,
                            numOfImages: existing.numOfImages + 1,
                            numOfAnnotations: existing.numOfAnnotations + numberOfBoundingBox,
                            status: item.annotationStatus
                        });
                    } else {
                        nameMap.set(name, {
                            name: name,
                            numOfImages: 1,
                            numOfAnnotations: numberOfBoundingBox,
                            status: item.annotationStatus
                        });
                    }
                });
            });
            //   const jsonData=[{name: 'folder one', numOfImages: 2, numOfAnnotations: 13},
            //   {name: 'folder two', numOfImages: 1, numOfAnnotations: 1},
            //   {name: 'folder three', numOfImages: 1, numOfAnnotations: 10},
            //   {name: 'folder four', numOfImages: 2, numOfAnnotations: 4}]
            //  users = jsonData;
            // const {  users } = jsonData;
            const jsonData = Array.from(nameMap.values());
            setOrigData(jsonData);
            setFilteredData(jsonData);
            console.log("user:", jsonData)
            const searchInd = jsonData.map(user => {

                const allValues = crawl(user);
                return { allValues: allValues.toString() };
            });
            setSearchIndex(searchInd);
            if (jsonData) setLoading(false);
        };
        fetchData();
    }, [retrieve]);

    useEffect(() => {
        if (searchVal) {
            const reqData = searchIndex.map((user, index) => {
                if (user.allValues.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0)
                    return origData[index];
                return null;
            });
            setFilteredData(
                reqData.filter(user => {
                    if (user) return true;
                    return false;
                })
            );
        } else setFilteredData(origData);
    }, [searchVal, origData, searchIndex]);

    return { filteredData, loading };
};