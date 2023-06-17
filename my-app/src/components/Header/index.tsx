import { useState } from "react";
import { Row, Col, Drawer } from "antd";
import { withTranslation } from "react-i18next";
import Container from "../../common/Container";
import { SvgIcon } from "../../common/SvgIcon";
import { Button } from "../../common/Button";
import {
  HeaderSection,
  LogoContainer,
  Burger,
  NotHidden,
  Menu,
  CustomNavLinkSmall,
  Label,
  Outline,
  Span,
} from "./styles";
import { Link } from 'react-router-dom';

const Header = ({ t }: any) => {
  const [visible, setVisibility] = useState(false);

  const showDrawer = () => {
    setVisibility(!visible);
  };

  const onClose = () => {
    setVisibility(!visible);
  };

  const MenuItem = () => {
    const scrollTo = (id: string) => {
      const element = document.getElementById(id) as HTMLDivElement;
      element.scrollIntoView({
        behavior: "smooth",
      });
      setVisibility(false);
    };
    return (
      <>

        <Link to="/">
          <CustomNavLinkSmall
          >
            <Span>
              {t("Home")}
            </Span>
          </CustomNavLinkSmall>
        </Link>


        <a href="https://mscs.dac.gov.in/MSCS/MobileLogin.aspx">
          <CustomNavLinkSmall>
            <Span>{t("Login")}</Span>
          </CustomNavLinkSmall>
          </a>

          <a href="https://mscs.dac.gov.in/Form1.aspx">
          <CustomNavLinkSmall>
            <Span>{t("Forms")}</Span>
          </CustomNavLinkSmall>
          </a>

          <a href="https://mscs.dac.gov.in/BankList.aspx">
          <CustomNavLinkSmall>
            <Span>{t("Banks")}</Span>
          </CustomNavLinkSmall>
          </a>

          <Link to="/societies">
          <CustomNavLinkSmall
            style={{
              minWidth:'140px'
            }}
          >
            <Span>
              <Button>{t("Societies")}</Button></Span>
          </CustomNavLinkSmall>
        </Link>

        <Link to="/viz">
          <CustomNavLinkSmall
            style={{
              minWidth:'140px'
            }}
          >
            <Span>
              <Button>{t("Visualizations")}</Button></Span>
          </CustomNavLinkSmall>
        </Link>
      </>
    );
  };

  return (
    <HeaderSection>
      <Container>
        <Row justify="space-between">
          <LogoContainer to="/" aria-label="homepage">
            <img src="/img/icons/MSCS_LOGO.png" width="100px" height="100px" />
          </LogoContainer>
          <NotHidden>
            <MenuItem />
          </NotHidden>
          <Burger onClick={showDrawer}>
            <Outline />
          </Burger>
        </Row>
        <Drawer closable={false} visible={visible} onClose={onClose}>
          <Col style={{ marginBottom: "2.5rem" }}>
            <Label onClick={onClose}>
              <Col span={12}>
                <Menu>Menu</Menu>
              </Col>
              <Col span={12}>
                <Outline />
              </Col>
            </Label>
          </Col>
          <MenuItem />
        </Drawer>
      </Container>
    </HeaderSection>
  );
};

export default withTranslation()(Header);
