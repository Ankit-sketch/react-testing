import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";
type Urls = string;
describe("ProductImageGallery", () => {
  it("should show null if there is no image", () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
  it("should render images with correct urls", () => {
    const imageUrls: Urls[] = ["hjasdja", "eeeee"];
    render(<ProductImageGallery imageUrls={imageUrls} />);
    const images = screen.getAllByRole("img");
    imageUrls.forEach((url, index) => {
      expect(images[index]).toHaveAttribute("src", url);
    });
  });
});
