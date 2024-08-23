import variables from 'config/variables';
import { Checkbox, Dropdown, Text } from 'components/Form/Settings';
import { Row, Content, Action, PreferencesWrapper } from 'components/Layout/Settings';

const FontOptions = () => {
  const fontWeight = 'settings:sections.appearance.font.weight';
  return (
    <>
      <PreferencesWrapper>
        <Row>
          <Content
            title={variables.getMessage('settings:sections.appearance.font.title')}
            subtitle={variables.getMessage('settings:sections.appearance.font.description')}
          />
          <Action>
            <Checkbox
              name="fontGoogle"
              text={variables.getMessage('settings:sections.appearance.font.google')}
              category="other"
            />
            <Text
              title={variables.getMessage('settings:sections.appearance.font.custom')}
              name="font"
              upperCaseFirst={true}
              category="other"
            />
          </Action>
        </Row>
      </PreferencesWrapper>
      <PreferencesWrapper>
        <Row>
          <Content
            title={variables.getMessage('settings:sections.appearance.font.title')}
            subtitle={variables.getMessage('settings:sections.appearance.font.description')}
          />
          <Action>
            {/* names are taken from https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight */}
            <Dropdown
              label={variables.getMessage('settings:sections.appearance.font.weight.title')}
              name="fontweight"
              category="other"
              items={[
                {
                  value: '100',
                  text: variables.getMessage(fontWeight + '.thin'),
                },
                {
                  value: '200',
                  text: variables.getMessage(fontWeight + '.extra_light'),
                },
                {
                  value: '300',
                  text: variables.getMessage(fontWeight + '.light'),
                },
                {
                  value: '400',
                  text: variables.getMessage(fontWeight + '.normal'),
                },
                {
                  value: '500',
                  text: variables.getMessage(fontWeight + '.medium'),
                },
                {
                  value: '600',
                  text: variables.getMessage(fontWeight + '.semi_bold'),
                },
                {
                  value: '700',
                  text: variables.getMessage(fontWeight + '.bold'),
                },
                {
                  value: '800',
                  text: variables.getMessage(fontWeight + '.extra_bold'),
                },
              ]}
            />
          </Action>
        </Row>
      </PreferencesWrapper>
      <PreferencesWrapper>
        <Row>
          <Content
            title={variables.getMessage('settings:sections.appearance.font.title')}
            subtitle={variables.getMessage('settings:sections.appearance.font.description')}
          />
          <Action>
            <Dropdown
              label={variables.getMessage('settings:sections.appearance.font.style.title')}
              name="fontstyle"
              category="other"
              items={[
                {
                  value: 'normal',
                  text: variables.getMessage('settings:sections.appearance.font.style.normal'),
                },
                {
                  value: 'italic',
                  text: variables.getMessage('settings:sections.appearance.font.style.italic'),
                },
                {
                  value: 'oblique',
                  text: variables.getMessage('settings:sections.appearance.font.style.oblique'),
                },
              ]}
            />
          </Action>
        </Row>
      </PreferencesWrapper>
    </>
  );
};

export { FontOptions as default, FontOptions };
