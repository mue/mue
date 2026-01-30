import variables from 'config/variables';
import { useState, memo } from 'react';
import { MdWidgets, MdClose, MdCheck } from 'react-icons/md';
import { Tooltip } from 'components/Elements';
import { Button } from 'components/Elements';
import 'components/Form/Settings/Checkbox/Checkbox.scss';

function AddWidgetModal({ urlError, addWidget, closeModal, edit, editData, editWidget }) {
  const [name, setName] = useState(edit ? editData.name : '');
  const [url, setUrl] = useState(edit ? editData.url : '');
  const [position, setPosition] = useState(edit ? editData.position : 'center');
  const [renderAbove, setRenderAbove] = useState(edit ? (editData.renderAbove || false) : false);

  return (
    <div className="addLinkModal">
      <div className="shareHeader">
        <span className="title">
          {edit
            ? variables.getMessage('modals.main.settings.sections.advanced.custom_widget_edit')
            : variables.getMessage('modals.main.settings.sections.advanced.custom_widget_new')}
        </span>
        <Tooltip title={variables.getMessage('modals.main.settings.buttons.close')}>
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
            placeholder={variables.getMessage('modals.main.settings.sections.advanced.custom_widget_name')}
            value={name}
            onChange={(e) => setName(e.target.value.replace(/(\r\n|\n|\r)/gm, ''))}
          />
        </div>
        <div className="text-field" style={{ gridColumn: 'span 2' }}>
          <input
            type="text"
            className="text-field-input"
            placeholder={variables.getMessage('modals.main.settings.sections.advanced.custom_widget_url')}
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
            <option value="center">Center (with other widgets)</option>
            <option value="top-left">Top Left</option>
            <option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-right">Bottom Right</option>
          </select>
        </div>
        <div className="text-field" style={{ gridColumn: 'span 2' }}>
          <div className="checkbox-wrapper">
            <span className="checkbox-label">Render above other widgets</span>
            <input
              type="checkbox"
              id="renderAbove"
              checked={renderAbove}
              onChange={(e) => setRenderAbove(e.target.checked)}
              className="checkbox-input"
              aria-label="Render above other widgets"
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
            label={variables.getMessage('modals.main.settings.sections.advanced.custom_widget_edit_button')}
          />
        ) : (
          <Button
            type="settings"
            onClick={() => addWidget(name, url, position, renderAbove)}
            icon={<MdWidgets />}
            label={variables.getMessage('modals.main.settings.sections.advanced.custom_widget_add')}
          />
        )}
      </div>
    </div>
  );
}

const MemoizedAddWidgetModal = memo(AddWidgetModal);
export { MemoizedAddWidgetModal as default, MemoizedAddWidgetModal as AddWidgetModal };
