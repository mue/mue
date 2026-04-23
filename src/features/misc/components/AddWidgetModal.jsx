import { useT } from 'contexts';
import { useState, memo } from 'react';
import { MdWidgets, MdClose, MdCheck } from 'react-icons/md';
import { Tooltip } from 'components/Elements';
import { Button } from 'components/Elements';
import 'components/Form/Settings/Checkbox/Checkbox.scss';

function AddWidgetModal({ urlError, addWidget, closeModal, edit, editData, editWidget }) {
  const t = useT();
  const [name, setName] = useState(edit ? editData.name : '');
  const [url, setUrl] = useState(edit ? editData.url : '');
  const [position, setPosition] = useState(edit ? editData.position : 'center');
  const [renderAbove, setRenderAbove] = useState(edit ? editData.renderAbove || false : false);

  return (
    <div className="addLinkModal">
      <div className="shareHeader">
        <span className="title">
          {edit
            ? t('modals.main.settings.sections.advanced.custom_widget.edit')
            : t('modals.main.settings.sections.advanced.custom_widget.new')}
        </span>
        <Tooltip title={t('modals.main.settings.buttons.close')}>
          <div className="close" onClick={() => closeModal()}>
            <MdClose />
          </div>
        </Tooltip>
      </div>
      <div className="quicklinkModalTextbox">
        <div className="text-field" style={{ gridColumn: 'span 2' }}>
          <input
            type="text"
            className="text-field-input"
            placeholder={t('modals.main.settings.sections.advanced.custom_widget.name')}
            value={name}
            onChange={(e) => setName(e.target.value.replace(/(\r\n|\n|\r)/gm, ''))}
          />
        </div>
        <div className="text-field" style={{ gridColumn: 'span 2' }}>
          <input
            type="text"
            className="text-field-input"
            placeholder={t('modals.main.settings.sections.advanced.custom_widget.url')}
            value={url}
            onChange={(e) => setUrl(e.target.value.replace(/(\r\n|\n|\r)/gm, ''))}
          />
        </div>
        <div className="text-field" style={{ gridColumn: 'span 2' }}>
          <select
            className="text-field-input"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            <option value="center">
              {t('modals.main.settings.sections.advanced.custom_widget.positions.center')}
            </option>
            <option value="top-left">
              {t('modals.main.settings.sections.advanced.custom_widget.positions.top_left')}
            </option>
            <option value="top-right">
              {t('modals.main.settings.sections.advanced.custom_widget.positions.top_right')}
            </option>
            <option value="bottom-left">
              {t('modals.main.settings.sections.advanced.custom_widget.positions.bottom_left')}
            </option>
            <option value="bottom-right">
              {t('modals.main.settings.sections.advanced.custom_widget.positions.bottom_right')}
            </option>
          </select>
        </div>
        <div className="text-field" style={{ gridColumn: 'span 2' }}>
          <div className="checkbox-wrapper">
            <span className="checkbox-label">
              {t('modals.main.settings.sections.advanced.custom_widget.render_above')}
            </span>
            <input
              type="checkbox"
              id="renderAbove"
              checked={renderAbove}
              onChange={(e) => setRenderAbove(e.target.checked)}
              className="checkbox-input"
              aria-label={t('modals.main.settings.sections.advanced.custom_widget.render_above')}
            />
            <div className={`checkbox-box ${renderAbove ? 'checked' : ''}`}>
              {renderAbove && <MdCheck />}
            </div>
          </div>
        </div>
      </div>
      <div className="addFooter">
        <span className="dropdown-error">{urlError}</span>
        {edit ? (
          <Button
            type="settings"
            onClick={() => editWidget(editData, name, url, position, renderAbove)}
            icon={<MdWidgets />}
            label={t('modals.main.settings.sections.advanced.custom_widget.edit_button')}
          />
        ) : (
          <Button
            type="settings"
            onClick={() => addWidget(name, url, position, renderAbove)}
            icon={<MdWidgets />}
            label={t('modals.main.settings.sections.advanced.custom_widget.add')}
          />
        )}
      </div>
    </div>
  );
}

const MemoizedAddWidgetModal = memo(AddWidgetModal);
export { MemoizedAddWidgetModal as default, MemoizedAddWidgetModal as AddWidgetModal };
