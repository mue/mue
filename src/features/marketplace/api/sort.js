import variables from 'config/variables';

export default function SortItems(data, method = 'a-z') {
  //const sort = localStorage.getItem('sortMarketplace') || method;
  const sort = method;

  variables.stats.postEvent('marketplace', 'sort');

  if (!data) {
    return data;
  }

  if (sort === 'a-z') {
    return data.sort((a, b) => {
      if (a.display_name < b.display_name) {
        return -1;
      }
      if (a.display_name > b.display_name) {
        return 1;
      }
      return 0;
    });
  }

  if (sort === 'z-a') {
    return data.sort((a, b) => {
      if (a.display_name > b.display_name) {
        return -1;
      }
      if (a.display_name < b.display_name) {
        return 1;
      }
      return 0;
    });
  }

  if (sort === 'newest') {
    return data.reverse();
  } else {
    return data;
  }
}
