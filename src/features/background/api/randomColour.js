/**
 * It returns a random colour or random gradient as a style object
 * @param type - The type of the style. This is used to determine which style builder to use.
 * @returns An object with two properties: type and style.
 */
export function randomColourStyleBuilder(type) {
  // randomColour based on https://stackoverflow.com/a/5092872
  const randomColour = () =>
    '#000000'.replace(/0/g, () => {
      return (~~(Math.random() * 16)).toString(16);
    });
  let style = `background:${randomColour()};`;

  if (type === 'random_gradient') {
    const directions = [
      'to right',
      'to left',
      'to bottom',
      'to top',
      'to bottom right',
      'to bottom left',
      'to top right',
      'to top left',
    ];
    style = `background:linear-gradient(${
      directions[Math.floor(Math.random() * directions.length)]
    }, ${randomColour()}, ${randomColour()});`;
  }

  return {
    type: 'colour',
    style,
  };
}
