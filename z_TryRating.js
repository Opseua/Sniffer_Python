import fs from 'fs';

const data = fs.readFileSync('z_Json.json', 'utf8');
const json = JSON.parse(data);

// Define a string desejada ("aaaaa" neste exemplo)
const searchString = "aaaaa";

// Utiliza map para extrair os valores das chaves "name" e "address"
const results = json.tasks[0].taskData.resultSet.resultList.map(result => {
    const address = result.value.address;
    const surveyKeys = result.surveyKeys['193']
    const comments = result.comments;

    return {

        name: result.value.name,
        address: [
            address[0] || '',
            address[1] || '',
            address[2] || '',
            address[3] || '',
            address[4] || ''
        ],

        lat: result.value.originalCenter.lat,
        lng: result.value.originalCenter.lng,
        ['surveyKeys_193']: surveyKeys,
        comments: [
            comments[0] || '',
            comments[1] || '',
            comments[2] || '',
            comments[3] || '',
            comments[4] || '',
            comments[5] || ''
        ],
    };
});

const newObj = {
    search: json.tasks[0].taskData.search,
    'query comments': json.tasks[0].taskData['query comments'],
    results
};

const final = JSON.stringify(newObj);
console.log(final);
