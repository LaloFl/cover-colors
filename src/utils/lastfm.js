import jimp from "jimp";

export const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY;

export function lastApiURL(uri) {
  return `https://ws.audioscrobbler.com/2.0/?method=${uri}&api_key=${LASTFM_API_KEY}&format=json`;
}

/** Get the top albums of a user sorted by color
 * @param user (Required) : The user name to fetch top albums for.
 * @param period (Optional) : overall | 7day | 1month | 3month | 6month | 12month - The time period over which to retrieve top albums for.
 * @param limit (Optional) : The number of results to fetch per page. Defaults to 50.
 */
export async function getTopAlbumsByColor(
  user,
  period = "overall",
  limit = 100
) {
  const res = await fetch(
    lastApiURL(
      `user.gettopalbums&user=${user}&period=${period}&limit=${limit}`
    ),
    { cache: "no-cache", keepalive: true }
  );
  const data = await res.json();
  const images = data["topalbums"]["album"].map((album) => {
    return album["image"][0]["#text"];
  });
  const hdImages = data["topalbums"]["album"].map((album) => {
    return album["image"][2]["#text"];
  });

  const getAverageColor = async (imageUrl) => {
    const image = await jimp.read(imageUrl);
    const width = image.getWidth();
    const height = image.getHeight();

    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    let totalA = 0;
    let count = 0;
    image.scan(0, 0, width, height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      const alpha = this.bitmap.data[idx + 3];

      totalR += red;
      totalG += green;
      totalB += blue;
      totalA += alpha;
      count++;
    });

    const color = {
      r: Math.floor(totalR / count),
      g: Math.floor(totalG / count),
      b: Math.floor(totalB / count),
      a: Math.floor(totalA / count),
    };

    return color;
  };

  const colors = [];
  for (const imageUrl of images) {
    try {
      colors.push(await getAverageColor(imageUrl));
    } catch (error) {
      colors.push("error");
    }
  }

  let imagesColor = [];
  imagesColor = [...hdImages].map((imgUrl, index) => {
    return { imgUrl, color: colors[index] };
  });

  imagesColor = imagesColor
    .filter((img) => {
      return img.color !== "error";
    })
    .sort((a, b) => {
      return (
        a.color.r + a.color.g + a.color.b - (b.color.r + b.color.g + b.color.b)
      );
    });
  return imagesColor;
}
