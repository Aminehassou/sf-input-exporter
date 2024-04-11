import "./App.scss";
import ImagesList from "./components/ImagesList";

const App = () => {
  return (
    <div className="flex-container">
      <label>Input Preview</label>
      <input />
      <div>
        <ImagesList />
      </div>
    </div>
  );
};

export default App;
