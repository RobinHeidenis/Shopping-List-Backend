export {};

const fetch = require("node-fetch");

exports.search = async (req, res) => {
  const { query } = req.params;

  fetch(`https://www.ah.nl/zoeken/api/products/search?query=${query}`).then(
    (response) =>
      response.json().then((result) => {
        res.json(
          result.cards.map((item) => {
            const product = item.products[0];

            const highestResImageIndex = product.images
              .map((image, index) => ({
                index,
                height: image.height,
              }))
              ?.sort((item1, item2) => item2.height - item1.height)[0]?.index;
            let highestResImageUrl = product.images[highestResImageIndex]?.url;
            if (!highestResImageUrl) highestResImageUrl = "cock";

            return {
              id: product.id,
              name: product.title,
              url: `https://ah.nl${product.link}`,
              price: {
                amount: product.price.now,
                unitSize: product.price.unitSize,
              },
              imageUrl: highestResImageUrl,
            };
          })
        );
      })
  );
};
