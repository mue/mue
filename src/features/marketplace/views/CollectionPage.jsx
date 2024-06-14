function CollectionPage() {
  async function installCollection() {
    setBusy(true);
    try {
      const installed = JSON.parse(localStorage.getItem('installed'));
      for (const item of items) {
        if (installed.some((i) => i.name === item.display_name)) continue; // don't install if already installed
        let { data } = await (
          await fetch(`${variables.constants.API_URL}/marketplace/item/${item.type}/${item.name}`, {
            signal: controller.signal,
          })
        ).json();
        install(data.type, data, false, true);
        variables.stats.postEvent('marketplace-item', `${item.display_name} installed}`);
        variables.stats.postEvent('marketplace', 'Install');
      }
      toast(variables.getMessage('toasts.installed'));
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast(variables.getMessage('toasts.error'));
    } finally {
      setBusy(false);
    }
  }

  function returnToMain() {
    setCollection(false);
  }

  return (
    <>
      <Header
        title={variables.getMessage('modals.main.navbar.marketplace')}
        secondaryTitle={collectionTitle}
        report={false}
        goBack={() => returnToMain()}
      />
      <div
        className="collectionPage"
        style={
          {
            //  backgroundImage: `linear-gradient(to bottom, transparent, black), url('${collectionImg}')`,
          }
        }
      >
        <div className="nice-tag">{variables.getMessage('modals.main.marketplace.collection')}</div>
        <div className="content">
          <span className="mainTitle">{collectionTitle}</span>={' '}
        </div>

        <Button
          type="collection"
          onClick={() => installCollection()}
          disabled={busy}
          icon={<MdLibraryAdd />}
          label={
            busy
              ? variables.getMessage('modals.main.marketplace.installing')
              : variables.getMessage('modals.main.marketplace.add_all')
          }
        />
      </div>
    </>
  );
}

export default CollectionPage;
