import Tabs from './backend/Tabs';

import Added from '../marketplace/sections/Added';
import Sideload from '../marketplace/sections/Sideload';
import Create from '../marketplace/sections/Create';

export default function Addons() {
  const addons = window.language.modals.main.addons;

  return (
    <Tabs>
      <div label={addons.added} name='added'><Added/></div>
      <div label={addons.sideload} name='sideload'><Sideload/></div>
      <div label={addons.create.title} name='create'><Create/></div>
    </Tabs>
  );
}
