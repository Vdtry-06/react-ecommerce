"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ApiService from "../../service/ApiService"
import "../../static/style/productDetailsPages.css"
import {
  Row,
  Col,
  Typography,
  Rate,
  InputNumber,
  Button,
  Tabs,
  Tag,
  List,
  Space,
  Spin,
  message,
  Form,
  Input,
} from "antd"
import { CheckOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons"

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { TextArea } = Input

const ProductDetailsPages = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [hoveredImage, setHoveredImage] = useState(null)
  const [userRating, setUserRating] = useState(5)
  const [wishlist, setWishlist] = useState([])

  const fetchData = async () => {
    try {
      if (ApiService.isAuthenticated()) {
        const userInfo = await ApiService.getMyInfo()
        const ordersResponse = await ApiService.getAllOrdersOfUser(userInfo.data.id)
        const pendingOrder = ordersResponse.data?.find((order) => order.status === "PENDING")

        if (pendingOrder?.orderLines) {
          setCart(
            pendingOrder.orderLines.map((line) => ({
              id: line.productId,
              qty: line.quantity,
              orderLineId: line.id,
            })),
          )
        }
      }
    } catch (error) {
      console.log(error.message || error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const response = await ApiService.getProduct(productId)
        setProduct(response.data)
        await fetchData()
      } catch (error) {
        console.log(error.message || error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [productId])

  const addToCart = async () => {
    if (!product) return

    try {
      setIsProcessing(true)

      if (!ApiService.isAuthenticated()) {
        const confirmLogin = window.confirm("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng! Đến trang đăng nhập?")
        if (confirmLogin) navigate("/login")
        return
      }

      const userInfo = await ApiService.getMyInfo()
      const ordersResponse = await ApiService.getAllOrdersOfUser(userInfo.data.id)
      const pendingOrder = ordersResponse.data?.find((order) => order.status === "PENDING")
      const orderLineRequest = { productId: product.id, quantity: quantity }

      if (!pendingOrder) {
        const result = await ApiService.createOrder({
          userId: userInfo.data.id,
          orderLines: [orderLineRequest],
          paymentMethod: "CASH_ON_DELIVERY",
        })
        // Update local cart state
        setCart([{ id: product.id, qty: quantity, orderLineId: result.data.orderLines[0].id }])
      } else {
        const existingLine = pendingOrder.orderLines.find((line) => line.productId === product.id)
        if (existingLine) {
          await ApiService.updateOrderLine(pendingOrder.id, existingLine.id, {
            ...orderLineRequest,
            quantity: existingLine.quantity + quantity,
          })
          // Update local cart state
          setCart((prevCart) => {
            const updatedCart = [...prevCart]
            const itemIndex = updatedCart.findIndex((item) => item.id === product.id)
            if (itemIndex >= 0) {
              updatedCart[itemIndex] = {
                ...updatedCart[itemIndex],
                qty: updatedCart[itemIndex].qty + quantity,
              }
            }
            return updatedCart
          })
        } else {
          const result = await ApiService.addOrderLine(pendingOrder.id, orderLineRequest)
          // Update local cart state
          setCart((prevCart) => [
            ...prevCart,
            {
              id: product.id,
              qty: quantity,
              orderLineId: result.data.id,
            },
          ])
        }
      }

      message.success("Sản phẩm đã được thêm vào giỏ hàng!")
    } catch (error) {
      message.error("Lỗi khi thêm vào giỏ hàng!")
    } finally {
      setIsProcessing(false)
    }
  }

  const buyNow = async () => {
    try {
      setIsProcessing(true)
      await addToCart()
      navigate("/cart")
    } catch (error) {
      message.error("Lỗi khi mua hàng!")
    } finally {
      setIsProcessing(false)
    }
  }

  const updateQuantity = async (increment) => {
    if (!product) return

    try {
      setIsProcessing(true)
      const userInfo = await ApiService.getMyInfo()
      const ordersResponse = await ApiService.getAllOrdersOfUser(userInfo.data.id)
      const pendingOrder = ordersResponse.data?.find((order) => order.status === "PENDING")

      if (!pendingOrder) return

      const orderLine = pendingOrder.orderLines.find((line) => line.productId === product.id)
      if (!orderLine) return

      const newQuantity = orderLine.quantity + (increment ? 1 : -1)

      // Update local cart state first for immediate UI feedback
      setCart((prevCart) => {
        const updatedCart = [...prevCart]
        const itemIndex = updatedCart.findIndex((item) => item.id === product.id)

        if (itemIndex >= 0) {
          if (newQuantity > 0) {
            updatedCart[itemIndex] = {
              ...updatedCart[itemIndex],
              qty: newQuantity,
            }
          } else {
            // Remove item from cart if quantity is 0
            updatedCart.splice(itemIndex, 1)
          }
        }
        return updatedCart
      })

      if (newQuantity > 0) {
        await ApiService.updateOrderLine(pendingOrder.id, orderLine.id, {
          productId: product.id,
          quantity: newQuantity,
        })
      } else {
        await ApiService.deleteOrderLine(pendingOrder.id, orderLine.id)
      }
    } catch (error) {
      message.error(increment ? "Lỗi khi tăng số lượng!" : "Lỗi khi giảm số lượng!")
      // Revert the cart state if there was an error
      fetchData()
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId))
    } else {
      setWishlist([...wishlist, productId])
    }
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
      </div>
    )
  }

  if (!product) {
    return <div className="error-container">Không tìm thấy sản phẩm</div>
  }

  const cartItem = cart.find((item) => item.id === product.id)

  // Thumbnail images
  const thumbnails = [
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oCDYrDhBNiRat9hM0JEG963hpW12qk.png",
      alt: "Pizza",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RNRpd8Qo2E88qKUOlV9YZOf9IF9sD8.png",
      alt: "Chicken Nuggets",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vow3IiYbxsJxMDPhqpdTCeWWS77GnE.png",
      alt: "Fries",
    },
    {
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oCDYrDhBNiRat9hM0JEG963hpW12qk.png",
      alt: "Burger",
    },
  ]

  // Mock data for the product
  const mockProduct = {
    name: "RUTI WITH BEEF SLICE",
    price: 28.99,
    originalPrice: 30.52,
    discount: 5,
    description:
      "There are many variations of passages of Lorem Ipsum available, but majority have suffered teration in some form, by injected humour, or randomised",
    sku: "PRODUCT1",
    categories: "BURGER",
    tags: "BURGER, PASTA",
  }

  // Use mock data if product data is incomplete
  const displayProduct = {
    ...product,
    name: product.name || mockProduct.name,
    price: product.price || mockProduct.price,
    originalPrice: product.originalPrice || mockProduct.originalPrice,
    discount: product.discount || mockProduct.discount,
    description: product.description || mockProduct.description,
    sku: product.id || mockProduct.sku,
    categories: product.category || mockProduct.categories,
    tags: product.tags?.join(", ") || mockProduct.tags,
  }

  // Related products
  const relatedProducts = [
    {
      id: "related1",
      name: "RUTI WITH BEEF SLICE",
      price: 28.99,
      originalPrice: 30.52,
      discount: 5,
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vow3IiYbxsJxMDPhqpdTCeWWS77GnE.png",
      rating: 5,
    },
    {
      id: "related2",
      name: "WHOPPER BURGER KING",
      price: 28.99,
      originalPrice: 30.52,
      discount: 5,
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vow3IiYbxsJxMDPhqpdTCeWWS77GnE.png",
      rating: 5,
    },
    {
      id: "related3",
      name: "CHINESS PASTA",
      price: 28.99,
      originalPrice: 30.52,
      discount: 5,
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vow3IiYbxsJxMDPhqpdTCeWWS77GnE.png",
      rating: 5,
    },
    {
      id: "related4",
      name: "DELICIOUS BURGER",
      price: 28.99,
      originalPrice: 30.52,
      discount: 5,
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vow3IiYbxsJxMDPhqpdTCeWWS77GnE.png",
      rating: 5,
    },
  ]

  // Comments
  const comments = [
    {
      author: "Food Expert",
      date: "2024-04-17 23:38",
      content: "Their product is great, I highly recommend it!",
    },
    {
      author: "Food Blogger",
      date: "2024-04-17 23:43",
      content: "I totally agree, this is my new favorite place to eat!",
    },
  ]

  return (
    <div className="product-details-container">
      <div className="product-detail-top">
        <div className="product-detail-layout">
          <div className="product-images-container">
            <div className="main-image-container">
              <img
                src={
                  product.imageUrl ||
                  (hoveredImage !== null
                    ? thumbnails[hoveredImage].src
                    : selectedImage !== null
                      ? thumbnails[selectedImage].src
                      : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RNRpd8Qo2E88qKUOlV9YZOf9IF9sD8.png")
                }
                alt={displayProduct.name}
              />
              {displayProduct.discount > 0 && <div className="discount-badge">-{displayProduct.discount}%</div>}
            </div>
            <div className="thumbnails-container">
              {thumbnails.map((thumb, index) => (
                <div
                  key={index}
                  className={`thumbnail-image ${selectedImage === index ? "active" : ""}`}
                  onClick={() => setSelectedImage(index)}
                  onMouseEnter={() => setHoveredImage(index)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <img src={thumb.src || "/placeholder.svg"} alt={thumb.alt} />
                </div>
              ))}
            </div>
          </div>

          <div className="product-info">
            <Rate disabled defaultValue={5} style={{ color: "#FFD700", fontSize: 16, marginBottom: 16 }} />

            <Title level={2} style={{ margin: "0 0 16px 0", fontWeight: "bold" }}>
              {displayProduct.name}
            </Title>

            <Paragraph style={{ marginBottom: 24 }}>{displayProduct.description}</Paragraph>

            <div className="product-price">
              <Tag color="#f50" style={{ marginRight: 8, fontSize: 14 }}>
                -{displayProduct.discount}%
              </Tag>
              <span className="current-price">${displayProduct.price?.toFixed(2)}</span>
              {displayProduct.originalPrice && (
                <span className="original-price">${displayProduct.originalPrice.toFixed(2)}</span>
              )}
            </div>

            {cartItem ? (
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(false)} disabled={isProcessing}>
                  -
                </button>
                <span>{isProcessing ? "..." : cartItem.qty}</span>
                <button onClick={() => updateQuantity(true)} disabled={isProcessing}>
                  +
                </button>
              </div>
            ) : (
              <>
                <div className="quantity-input-container">
                  <InputNumber
                    min={1}
                    max={product.availableQuantity || 10}
                    value={quantity}
                    onChange={(value) => setQuantity(value)}
                    className="quantity-input"
                  />
                </div>
                <Button
                  type="primary"
                  size="large"
                  onClick={addToCart}
                  disabled={isProcessing || product.availableQuantity <= 0}
                  className="add-to-cart-button"
                >
                  {isProcessing ? "Đang xử lý..." : "ADD TO CART"}
                </Button>
              </>
            )}

            <div className="product-meta">
              <div className="meta-item">
                <Text strong>SKU:</Text>
                <Text>{displayProduct.sku}</Text>
              </div>
              <div className="meta-item">
                <Text strong>CATEGORIES:</Text>
                <Text>{displayProduct.categories}</Text>
              </div>
              <div className="meta-item">
                <Text strong>TAGS:</Text>
                <Text>{displayProduct.tags}</Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs section */}
      <div className="product-detail-content">
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" className="product-tabs">
          <TabPane tab="DESCRIPTION" key="description">
            <div className="tab-content">
              <Title level={3} style={{ fontWeight: "bold", marginBottom: 24 }}>
                EXPERIENCE IS OVER THE WORLD VISIT
              </Title>
              <Paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vulputate vestibulum Phasellus
                rhoncus, dolor eget viverra pretium, dolor Numquam odit accusantium odit aut commodi et. Nostrum est
                atque ut dolorum. Et sequi aut atque doloribus qui. Iure amet in voluptate reiciendis. Perspiciatis
                consequatur aperiam repellendus velit quia est minima. tellus aliquet nunc vitae ultricies erat elit eu
                lacus. Vestibulum non justo consectetur, cursus ante, tincidunt sapien. Nulla quis diam sit amet turpis
                interdum accumsan quis necenim. Vivamus faucibus ex sed nibh egestas elementum. Mauris et bibendum dui.
                Aenean consequat pulvinar luctus
              </Paragraph>
            </div>
          </TabPane>
          <TabPane tab="SPECIFICATIONS" key="specifications">
            <div className="tab-content">
              <div className="product-specifications">
                <h2>Thông số kỹ thuật</h2>
                <table className="specs-table">
                  <tbody>
                    <tr>
                      <td>Mã sản phẩm</td>
                      <td>{product.id || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>Cân nặng</td>
                      <td>{product.dimensions || "Chưa cập nhật"}</td>
                    </tr>
                    <tr>
                      <td>Chiều rộng</td>
                      <td>{product.material || "Chưa cập nhật"}</td>
                    </tr>
                    <tr>
                      <td>Chiều dài</td>
                      <td>{product.warranty || "Chưa cập nhật"}</td>
                    </tr>
                    <tr>
                      <td>Chiều cao</td>
                      <td>{product.warranty || "Chưa cập nhật"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabPane>
          <TabPane tab="COMMENT (2)" key="comment">
            <div className="tab-content">
              <div className="comments-section">
                {comments.map((comment, index) => (
                  <div key={index} className="comment-item">
                    <h3 className="comment-author">{comment.author}</h3>
                    <div className="comment-date">{comment.date}</div>
                    <p className="comment-content">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabPane>
          <TabPane tab="POST A COMMENT" key="post-comment">
            <div className="tab-content">
              <div className="post-comment-section">
                <div className="rating-section">
                  <div className="rating-label">Vote:</div>
                  <Rate value={userRating} onChange={setUserRating} />
                </div>

                <Form layout="vertical" className="comment-form">
                  <h3 className="form-title">Give your advice about this item:</h3>

                  <Form.Item label="Username:" name="username">
                    <Input />
                  </Form.Item>

                  <Form.Item name="comment">
                    <TextArea rows={6} placeholder="POST A COMMENT ..." />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" className="send-comment-button">
                      SEND A COMMENT
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>

      {/* More details section */}
      <div className="product-detail-content" style={{ marginTop: 30 }}>
        <Title level={3} style={{ fontWeight: "bold", marginBottom: 24 }}>
          MORE DETAILS
        </Title>

        <Row gutter={[32, 16]}>
          <Col xs={24} md={12}>
            <List
              itemLayout="horizontal"
              dataSource={[
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
                "Lorem Ipsum has been the's standard dummy text. Lorem Ipsumum is simply dummy text.",
                "type here your detail one by one li more add",
                "has been the industry's standard dummy text ever since. Lorem Ips",
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Space>
                    <CheckOutlined style={{ color: "#006241" }} />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Col>
          <Col xs={24} md={12}>
            <List
              itemLayout="horizontal"
              dataSource={[
                "Lorem Ipsum generators on the tend to repeat.",
                "If you are going to use a passage.",
                "Lorem Ipsum generators on the tend to repeat.",
                "Lorem Ipsum generators on the tend to repeat.",
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Space>
                    <CheckOutlined style={{ color: "#006241" }} />
                    <Text>{item}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </div>

      {/* Related Products Section */}
      <div className="related-products-section">
        <Title level={2} className="section-title">
          RELATED PRODUCTS
        </Title>

        <Row gutter={[16, 16]} className="related-products-grid">
          {relatedProducts.map((relatedProduct) => (
            <Col xs={12} sm={12} md={6} key={relatedProduct.id}>
              <div className="related-product-card">
                <div className="wishlist-button" onClick={() => toggleWishlist(relatedProduct.id)}>
                  {wishlist.includes(relatedProduct.id) ? (
                    <HeartFilled className="heart-icon filled" />
                  ) : (
                    <HeartOutlined className="heart-icon" />
                  )}
                </div>

                <div className="related-product-image">
                  <img src={relatedProduct.imageUrl || "/placeholder.svg"} alt={relatedProduct.name} />
                </div>

                <div className="related-product-info">
                  <div className="related-product-price">
                    <Tag color="#f50" className="discount-tag">
                      -{relatedProduct.discount}%
                    </Tag>
                    <span className="current-price">${relatedProduct.price.toFixed(2)}</span>
                    <span className="original-price">${relatedProduct.originalPrice.toFixed(2)}</span>
                  </div>

                  <h3 className="related-product-name">{relatedProduct.name}</h3>

                  <div className="related-product-rating">
                    <Rate disabled defaultValue={relatedProduct.rating} />
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default ProductDetailsPages

