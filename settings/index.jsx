const settingsPage = props => 
  (<Page>
      <Section
          description={<Text>Here you'll be able to customize the home and work stations for the Fitbit app.</Text>}
          title={<Text bold align="left">Smartport settings</Text>}>
          <Text>
            Introduce the bus/tram/train station closest to your home, and the station that is closest to your work place.
          </Text>
          <TextInput
            label="Home station"
            settingsKey="home"
          />
          <TextInput
            label="Work station"
            settingsKey="work"
          />
      </Section>
  </Page>)

registerSettingsPage(settingsPage);