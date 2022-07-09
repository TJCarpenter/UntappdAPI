const API_KEY_RW = "kHzx73wJBb1_ZANoif_R";
const API_KEY_R = "Kgjk8gfh4mBys-1pf_Br";
const EMAIL = "tom@2tomsbrewing.com";
const TOKEN = `Basic ${btoa(`${EMAIL}:${API_KEY_RW}`)}`;
const BREWERY_ID = "229502";

console.log(TOKEN);

const getLocationID = async () => {
  const endpoint = "https://business.untappd.com/api/v1/locations";

  let result = await fetch(endpoint, {
    method: "GET",
    headers: { Authorization: TOKEN },
  }).then((response) => response.json());

  return result.locations[0].id;
};

const parseObject = (o) => {
  if (o.item.untappd_brewery_id == BREWERY_ID) {
    return {
      brewery: o.item.brewery,
      item_id: o.id,
      unappd_id: o.item.untappd_id,
      beer_id: o.item.id,
      date_created: o.created_at,
      abv: o.item.abv,
      calories: o.item.calories,
      ibu: o.item.ibu,
      in_production: o.item.in_production,
      label_image: o.item.label_image,
      label_image_hd: o.item.label_image_hd,
      name: o.item.name,
      description: o.item.description,
      style: o.item.style,
      type: o.item.type,
    };
  }
};

const parseResults = (results) => {
  let parsedResults = [];

  results.forEach((result) => {
    let parsedObject = parseObject(result);

    if (parsedObject) {
      parsedResults.push(parsedObject);
    }
  });

  return parsedResults;
};

const getResults = async (endpoint) => {
  let result = await fetch(endpoint, {
    method: "GET",
    headers: { Authorization: TOKEN },
  }).then((response) => response.json());

  return result.historical_items;
};

const getMenuHistory = async () => {
  const locationID = await getLocationID();

  let numResults = 14;
  let page = 1;

  let items = [];

  while (numResults == 14) {
    const endpoint = `https://business.untappd.com/api/v1/locations/${locationID}/historical_items?page=`;

    let results = await getResults(endpoint + page);

    // Set the Number of Results
    numResults = results.length;

    // Increment the page
    page += 1;

    let parsedResults = parseResults(results);
    items = [...items, ...parsedResults];
  }

  console.log("Beers Loaded");

  items = items.filter(
    (item, index, self) => self.findIndex((i) => i.name === item.name) === index
  );

  return items;
};

const createItemColumn = (item) => {
  let col = document.createElement("div");
  col.className = "col card m-3 p-2";

  let image = document.createElement("img");
  image.setAttribute("src", item.label_image);
  image.style = "height: 10rem; width: 10rem; margin: 2rem auto;";
  col.appendChild(image);

  let name = document.createElement("h2");
  name.innerText = item.name;

  let style = document.createElement("h3");
  style.innerText = item.style;

  let description = document.createElement("p");
  description.innerText = item.description;

  col.append(name, style, description);

  return col;
};

const displayBeers = async () => {
  let items = await getMenuHistory();

  const itemsPerRow = 3;

  const beerlist = document.getElementById("beerlist");

  for (let i = 0; i < items.length; i += itemsPerRow) {
    let row = document.createElement("div");
    row.className = "row";

    let col0 = createItemColumn(items[i]);
    let col1 = createItemColumn(items[i + 1]);
    let col2 = createItemColumn(items[i + 2]);

    beerlist.append(row);
    row.append(col0, col1, col2);
  }
};

displayBeers();
