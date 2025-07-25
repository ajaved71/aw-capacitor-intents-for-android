import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import './Home.css';

import { CapacitorIntents } from 'aw-capacitor-intents-android';
import { useCallback, useState } from 'react';

const Home: React.FC = () => {
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);

  let receiverId: string | null = null;
  const [isTestSetup, setIsTestSetup] = useState<boolean>(false);
  const [testState, setTestState] = useState<boolean | null>(null);

  const action = 'example.your.test.action';

  const setupPluginTest = async () => {
    const rId = await CapacitorIntents.registerBroadcastReceiver({filters: [action]}, async (data) => {
      // data is a JS Object but could contain any structure
      console.dir(JSON.stringify(data));
      console.log(receiverId);


      const hasResulInfo = Object.prototype.hasOwnProperty.call(data.extras, 'testValue')
      if (hasResulInfo) {
        if (data.extras['testValue'] === "Test String" && receiverId !== null) {
          setTestState(true);
        } else {
          setTestState(false);
        }
      } 

      // now unregister
      if(receiverId !== null) {
        await CapacitorIntents.unregisterBroadcastReceiver({id: receiverId});
        receiverId = null;
      }

      forceUpdate();
    });

    receiverId = `${rId}`;
    setTestState(null);
    setIsTestSetup(true);
  }

  const testPlugin = async () => {
    await CapacitorIntents.sendBroadcastIntent({action: action, extras: {testValue: "Test String"}});
    setIsTestSetup(false);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div>
          <IonButton disabled={isTestSetup} onClick={setupPluginTest}>Setup Test</IonButton>
          <IonButton disabled={!isTestSetup} onClick={testPlugin}>Run Test</IonButton>
          <p><span style={{fontWeight: 'bolder'}}>Test Passed:</span> {testState === null ? "Not Yet Run" : (testState ? "Passed" : "Failed")}</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
