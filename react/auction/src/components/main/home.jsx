import React from "react";
import {Header} from "./Header";
import {Footer} from "./Footer";
import "./home.css";

export const Home = () => {

  return (
    <div className="homepage">
      <Header page="Home"/>
      <div className="container" id="body">
        <div className="row col-10 offset-1 justify-text">
          <h3 className="text-center mb-4">Lorem Ipsum text</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            vulputate auctor enim eu cursus. Aliquam mattis convallis ante eu
            feugiat. Mauris nec viverra tellus. Phasellus et tortor in erat
            rhoncus eleifend. Proin mollis egestas nibh. In sit amet porttitor
            velit. Mauris hendrerit sapien quis nibh aliquam, eu faucibus quam
            lobortis. Donec in interdum sapien. Duis libero augue, molestie id
            finibus eu, fermentum quis nisl. Etiam et fringilla tortor. Praesent
            id dapibus ex.
          </p>
          <p>
            Vestibulum commodo sagittis fermentum. Donec vel dui metus.
            Vestibulum luctus odio et ex ultricies pellentesque. Aliquam
            sollicitudin auctor erat, id dapibus elit dictum eu. Aliquam
            dignissim, augue sed facilisis dignissim, est ipsum mollis diam, ut
            venenatis risus felis vitae tortor. Duis quis metus semper, rhoncus
            quam a, imperdiet mi. Suspendisse vel eros eget ante tempor aliquam
            ut id quam. Sed vestibulum eleifend nisi, eget posuere nunc
            ullamcorper id. Integer tellus mauris, consequat luctus metus at,
            porta fringilla sapien. Pellentesque fringilla accumsan tempus.
            Donec in odio sit amet lorem rutrum viverra. Morbi a eleifend dolor,
            ut tristique diam. Cras ac tellus non dui pharetra dictum molestie
            et ipsum. Aliquam erat volutpat. Integer ante neque, fringilla vel
            porta vitae, porta non nisl. Aliquam feugiat tellus erat, in
            sollicitudin sapien malesuada ac.
          </p>
          <p>
            Sed blandit lobortis fringilla. Sed fringilla fermentum ultricies.
            Nulla rutrum purus sed nunc iaculis efficitur. Phasellus nec nunc et
            tellus elementum convallis. Aenean malesuada aliquam lacinia.
            Aliquam ultricies, urna eu finibus ultrices, purus dui fringilla
            odio, ac aliquet libero tortor a purus. Aliquam id felis nisl.
            Phasellus non massa blandit massa commodo tincidunt eget eu purus.
            Suspendisse imperdiet luctus erat ut viverra.
          </p>
          <p>
            Mauris tincidunt massa felis, ac consectetur mauris venenatis non.
            Suspendisse potenti. Nullam quis ipsum imperdiet, rutrum enim
            faucibus, fringilla nisi. Vestibulum tristique mi ac urna
            pellentesque posuere. Pellentesque dignissim ligula quis dolor
            ultrices tempor. Sed commodo lectus enim, at vestibulum neque
            sagittis at. Vivamus finibus pretium enim ac consectetur. Vivamus
            quis interdum nisl, in pharetra erat. Praesent ac feugiat risus.
            Fusce sodales sem ante, tincidunt mattis lacus interdum in. Quisque
            sed lorem aliquet, consequat nisl id, varius ipsum. In pulvinar
            laoreet cursus. Praesent aliquam tempor est id tempor.
          </p>
          <p>
            Sed placerat tincidunt posuere. Donec sit amet mauris felis. Ut sed
            orci nec mauris vehicula efficitur. Nunc tincidunt est nisi, in
            scelerisque magna consectetur sed. Donec lectus enim, suscipit
            porttitor augue quis, vehicula molestie neque. Mauris elementum
            facilisis lectus, semper facilisis libero rutrum sit amet. Nunc ac
            felis sed elit posuere cursus et sit amet elit.
          </p>
          <p>
            Fusce pulvinar a enim in pretium. Nulla facilisi. Aliquam vitae eros
            vel neque dictum auctor. Maecenas sed sem in nisi maximus
            sollicitudin. Pellentesque varius volutpat lorem quis iaculis. Donec
            tempus dictum tincidunt. Nulla a tortor quis ipsum laoreet commodo.
            Ut tincidunt, leo quis condimentum placerat, metus tellus facilisis
            massa, volutpat ullamcorper libero leo non tortor. Mauris commodo
            lectus arcu, nec iaculis dui accumsan a.
          </p>
          <p>
            Maecenas iaculis at massa a vulputate. Fusce a lorem non augue
            consectetur ullamcorper. Maecenas aliquam vestibulum mi, in
            hendrerit velit rutrum et. Class aptent taciti sociosqu ad litora
            torquent per conubia nostra, per inceptos himenaeos. Etiam sem urna,
            venenatis et ex quis, facilisis auctor sapien. Fusce ex libero,
            hendrerit ut purus et, sollicitudin tincidunt diam. Ut commodo odio
            vitae neque mollis, at tempus tellus placerat. Integer id velit
            nulla. Proin venenatis magna at blandit consequat.
          </p>
          <p>
            Nam nec libero non augue iaculis pretium. Suspendisse dapibus dolor
            arcu. Cras eleifend gravida ex, sed molestie nibh vestibulum et.
            Nunc sit amet ipsum et purus facilisis luctus. Nullam est sem,
            dapibus et augue et, finibus pharetra quam. Phasellus tristique
            lobortis nulla ac rutrum. Proin blandit justo a risus laoreet
            accumsan. Pellentesque nibh neque, hendrerit non nisl quis,
            dignissim lobortis erat. Sed in nisi quis odio bibendum mattis. Duis
            aliquam orci vulputate mauris convallis hendrerit. In convallis diam
            ac ultricies pellentesque. Sed auctor nunc nec justo ornare, sed
            molestie diam fringilla.
          </p>
          <p>
            Donec et pretium nunc, quis vestibulum turpis. Nullam at ante
            finibus, ullamcorper metus et, sagittis nulla. Sed in lorem a massa
            dapibus molestie. Donec libero massa, consectetur sit amet efficitur
            at, semper ac odio. Morbi non eros erat. Fusce semper ante quis
            dolor auctor, a egestas ipsum faucibus. Praesent et hendrerit lorem.
            Pellentesque habitant morbi tristique senectus et netus et malesuada
            fames ac turpis egestas. Aliquam condimentum porttitor sem, at
            gravida ex.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};
