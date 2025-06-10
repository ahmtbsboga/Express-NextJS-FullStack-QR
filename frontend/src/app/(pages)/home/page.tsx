import React, { FC, Suspense } from "react";
import HomeContent from "./homecontent/homeContent";

const Home: FC = () => {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <HomeContent />
    </Suspense>
  );
};

export default Home;
